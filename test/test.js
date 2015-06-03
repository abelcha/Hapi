var chai = require("chai");
chai.should();
var util = require('util');
chai.use(require('chai-http'));
chai.use(require('chai-string'));
var assert = chai.assert;
var expect = chai.expect;
var cookie = require('cookie')
var request = require('request');
var sessionCookie;
var g = {
    username: "abel_c",
    password: "toto42"
}
var data = require("./data/data.js")
require('colors');
var app;

var testPort = function(port, cb) {
    var url = "http://localhost:" + port;
    chai.request(url)
        .get('/ping')
        .end(function(err, res) {
            if (!err) {
                console.log(("    Connected to port " + port).green)
                app = chai.request.agent(url);
            }
            cb(!err)
        })
}

var x = function(err, res) {
    console.log(err, res);
}

var loginPageSample = '<input class="btn btn-lg btn-success btn-block" type="submit" id="login" value="Se Connecter">'

describe('Connection', function() {
    it('finding port', function(done) {
        testPort(8080, function(ok) {
            if (ok)
                return done();
            testPort(5000, function(ok) {
                if (!ok) {
                    console.log("Direct connection to server")
                    app = chai.request.agent(require(process.cwd() + '/api/app.js'))
                }
                return done();
            })
        })

    });
})


describe('Login', function() {
    it('check api access', function(done) {
        app.get('/api/intervention/12')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                done();
            })
    });

    it('login page redirection', function(done) {
        app.get('/dashboard')
            .end(function(err, res) {
                expect(res).to.have.status(401);
                assert((res.text).includes(loginPageSample), 'Not redirected to login page')
                done()
            })
    });
    it('bad username/password', function(done) {
        app.post('/login')
            .send({
                username: 'lol123',
                password: '123123',
                url: '/testurl'
            })
            .end(function(err, res) {
                expect(res).to.have.status(401);
                expect(res.redirects[0]).to.endsWith('/testurl' + '#failure')
                done()
            })
    });

    it('valid login', function(done) {
        app.post('/login')
            .send({
                username: g.username,
                password: g.password,
                url: '/test123'
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.redirects[0]).to.endsWith('/test123')
                expect(res.req).to.have.cookie('edison');
                //sessionCookie = res.headers['set-cookie'][0]
                done();
            })
    });

    it('who am i', function(done) {
        app.get('/api/whoAmI')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text);
                expect(resp.login).to.equal(g.username);
                done();
            })
    });
});

describe('API', function() {
    describe('DB', function() {
        describe('Interventions', function() {
            describe('Basic OP', function() {
                it('get /api/intervention/12', function(done) {
                    app.get('/api/intervention/12')
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            var resp = JSON.parse(res.text);
                            expect(resp._id).to.be.equal(12);
                            done();
                        })
                })
                it('get /api/intervention/123123123', function(done) {
                    app.get('/api/intervention/123123123')
                        .end(function(err, res) {
                            expect(res).to.have.status(400);
                            done();
                        })
                })
                it('post /api/intervention/{invalid}', function(done) {
                    app.post('/api/intervention')
                        .send()
                        .end(function(err, res) {
                            expect(res).to.have.status(400);
                            done();
                        })
                })
                it('post /api/intervention/{valid}', function(done) {
                    g.fakeData = data.intervention.createValid();
                    app.post('/api/intervention')
                        .send(g.fakeData)
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            var resp = JSON.parse(res.text);
                            expect(resp.client.nom).to.be.equalIgnoreCase(g.fakeData.client.nom);
                            g.id = resp.id;
                            done();
                        })
                })
                it('get /api/intervention/{valid}', function(done) {
                    app.get('/api/intervention/' + g.id)
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            var resp = JSON.parse(res.text);
                            expect(resp.client.prenom).to.be.equalIgnoreCase(g.fakeData.client.prenom);
                            expect(resp.login.ajout).to.be.equalIgnoreCase(g.username);
                            done();
                        })
                })
            });
        });
    });
});
describe('Logout', function() {

    it('logout', function(done) {
        app.get('/logout')
            .end(function(err, res) {
                expect(res.redirects).to.be.an('array').and.not.to.be.empty
                done();
            })
    });
});
