var json = require('json-file');
var supertest = require('supertest')
var superagent = require('superagent')
var binaryParser = require('superagent-binary-parser');
var _ = require('lodash')
var co = require('./common.js')
var Postmark = require('postmark-tracking');
var mailTracker = new Postmark("b2c424bc-af2b-4175-b76f-c863bb3915c3")
var chai = require('chai')
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;
chai.use(require('chai-string'));
var cookie = require('cookie')
var fs = require('fs')
var shell = require('shelljs')


var createArtisan = function(done) {
	var _this = this;
	co.api.post('/api/artisan')
		.set('Cookie', co.sessionCookies)
		.send(json.read('./tests/data/basic_sst.query.json').data)
		.expect(200)
		.end(function(err, resp) {
			should.not.exist(err);
			expect(resp).to.be.a('object');
			expect(resp.body.id).to.be.a('number');
			assert.deepEqual(co.regularize(resp.body), co.regularize(json.read('./tests/data/basic_sst.resp.json').data))
			_this.artisan = resp.body
			done(null, _this.artisan)
		})

}

var getEnv = function(done) {
	var _this = this;
	co.api.get('/api/env')
		.set('Cookie', co.sessionCookies)
		.end(function(err, resp) {
			_this.env = resp.body;
			done(null, resp.body)
		})
}

//52.41
var getMessageDetails = function(messageID, done, trys) {
	trys = trys ||  0;
	superagent.get('https://api.postmarkapp.com/messages/outbound/' + messageID + '/details')
		.set("X-Postmark-Server-Token", "b2c424bc-af2b-4175-b76f-c863bb3915c3")
		.accept("application/json")
		.end(function(err, resp) {
			if (err) {
				if (resp.body.ErrorCode === 701 && trys < 10) {
					return setTimeout(function() {
						getMessageDetails(messageID, done, trys + 1)
					}, 1000)
				}
				done(err)
			}
			done(null, resp.body)
		})

}

describe('Auth', function() {
	it('should not log in', function(done) {
		co.api.post('/login')
			.expect(400, done)
	})
	it('should not log in', function(done) {
		co.api.post('/login')
			.send({
				username: 'bb8',
			})
			.expect(400, done)
	})
	it('should not log in', function(done) {
		co.api.post('/login')
			.send({
				username: 'bb8',
				password: 'badpassword'
			})
			.expect(400, done)
	})
	it('should log in', function(done) {
		co.api.post('/login')
			.send(co.bot_usr)
			.expect(200)
			.end(function(err, resp) {
				should.not.exist(err);
				cookies = resp.headers['set-cookie']
				expect(cookie.parse(cookies[0]).EDISON).to.be.a('string')
				done()
			})
	})

	it('check session credentials', function(done) {
		co.api.get('/api/whoAmI')
			.set('Cookie', cookies)
			.end(function(err, resp) {
				expect(resp.body.login).to.be.equal('bot')
				done()
			})
	})

})



describe('artisan', function() {
	var _this = this;
	_this.test = 42;
	before(function(done) {
		shell.rm('-fr', './temp')
		shell.mkdir('temp')
		done()
	})
	before(co.login.bind(co));
	before(co.connectSocket.bind(this))
	before(getEnv.bind(_this))

	describe('add', function() {
		// Les trucs a checker :
		// - Que ca update le cache
		// - Que ca envoi une socket
		// - Que ca update les filtres
		it('should reinject late sockets', function(done) {
			co.delayMessage(_this.socket, 'ARTISAN_CACHE_LIST_CHANGE', 50)
			co.delayMessage(_this.socket, 'filterStatsReload', 100)
			done()
		})
		it('should add a basic artisan', function(done) {
			co.api.post('/api/artisan')
				.set('Cookie', co.sessionCookies)
				.send(json.read('./tests/data/basic_sst.query.json').data)
				.expect(200)
				.end(function(err, resp) {
					should.not.exist(err);
					expect(resp).to.be.a('object');
					expect(resp.body.id).to.be.a('number');
					assert.deepEqual(co.regularize(resp.body), co.regularize(json.read('./tests/data/basic_sst.resp.json').data))
					_this.artisan = resp.body
					done()
				})

		})
		it('should Get artisan_changed event', function(done) {
			_this.socket.on('ARTISAN_CACHE_LIST_CHANGE', _.once(function(e) {
				var socketsst = _.find(e.data, 'id', _this.artisan.id)
				assert.isObject(socketsst, "ARTISAN CHANGED SOCKET NOT RECEIVED");
				expect(socketsst.f.a_pot).to.be.equal(1);
				_this.socketsst = socketsst
				done();
			}))
		})
		it('should Get filterStatsReload event', function(done) {
			_this.socket.on('filterStatsReload', _.once(function(message) {
				var bot = _.find(message, 'login', 'bot');
				expect(bot).to.be.an('object');
				expect(bot.a_pot.total).to.be.at.least(1)
				done()
			}))
		})
		it('should get the artisan and compare with', function(done) {
			co.api.get('/api/artisan/' + _this.artisan.id)
				.set('Cookie', co.sessionCookies)
				.expect(200)
				.end(function(err, resp) {
					should.not.exist(err);
					assert.deepEqual(_.omit(_this.artisan, 'cache'), _.omit(resp.body, 'cache'))
					assert.deepEqual(_this.socketsst, resp.body.cache)
					done();
				})
		})
		it('should check in the cache list', function(done) {
			co.api.get('/api/artisan/getCacheList')
				.set('Cookie', co.sessionCookies)
				.expect(200)
				.end(function(err, resp) {
					should.not.exist(err);
					expect(resp.body).to.be.an('array');
					expect(resp.body.length).to.be.at.least(1);
					var cache = _.find(resp.body, 'id', _this.artisan.id);
					expect(cache).to.be.an('object');
					assert.deepEqual(_this.socketsst, cache)
					done()
				})
		})
	})

	describe("contract", function() {
		this.timeout(30000);
		if (!_this.artisan) {
			before(createArtisan.bind(_this))
		}
		it('preview', function(done) {
			var output = fs.createWriteStream('./temp/contrat-' + _this.artisan.id + '.pdf');
			co.api.get('/api/artisan/' + _this.artisan.id + '/contrat')
				.set('Cookie', co.sessionCookies)
				.expect(200)
				.expect('Content-Type', 'application/pdf')
				.parse(binaryParser)
				.end(function(err, resp) {
					assert.ok(Buffer.isBuffer(resp.body));
					should.not.exist(err);
					fs.writeFile('./temp/contrat-' + _this.artisan.id + '.pdf', resp.body, done)
				})
		})
		it('send', function(done) {
			var output = fs.createWriteStream('./temp/contrat-' + _this.artisan.id + '.pdf');
			co.api.post('/api/artisan/' + _this.artisan.id + '/sendContrat')
				.set('Cookie', co.sessionCookies)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, resp) {
					should.not.exist(err);
					expect(resp.body.MessageID).to.be.a('string');
					if (_this.env.APP_ENV === 'DEVELOPMENT') {
						expect(resp.body.To).to.be.equal('abel.chalier@gmail.com')
					} else {
						expect(resp.body.To).to.be.equalIgnoreCase(_this.artisan.email.toLowerCase())
					}
					_this.email = resp.body;
					done()
				})
		})
		it('verify', function(done) {
			getMessageDetails(_this.email.MessageID, function(err, resp) {
				should.not.exist(err);
				expect(resp).to.be.an('object')
				expect(resp.HtmlBody).includes('!DOCTYPE html PUBLIC');
				expect(resp.HtmlBody.length).to.be.at.least(100)
				expect(resp.To[0].Email).to.be.equal(_this.email.To);
				expect(resp.From).to.be.equal('"Edison Services - Service Partenariat" <yohann.rhoum@edison-services.fr>')
				expect(resp.Subject).to.be.equal('Proposition de partenariat')
				expect(resp.Attachments[0], 'Piece Jointe').to.be.equal('Declaration de sous-traitance.pdf')
				expect(resp.Status).to.be.equal('Sent')
				done()
			})
		})
	})

	describe("comment", function() {
		if (!_this.artisan) {
			before(createArtisan.bind(_this))
		}
		it('should add comment', function(done) {
			co.api.post('/api/artisan/' + _this.artisan.id + '/comment')
				.send({
					text: 'testcomment123456'
				})
				.set('Cookie', co.sessionCookies)
				.expect(200)
				.expect('Content-Type', /json/)
				.end(function(err, resp) {
					expect(resp.body.comments).to.be.an('array')
					expect(resp.body.comments[0]).to.be.an('object')
					expect(resp.body.comments[0].text).to.be.equal('testcomment123456');
					expect(resp.body.comments[0].login).to.be.equal(co.bot_usr.username);
					done()
				})
		})
	})
})
