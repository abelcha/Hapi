var chai = require("chai");
chai.should();
var assert = chai.assert;
var expect = chai.expect;
var cookie = require('cookie')
var superTest = require('supertest')
var request = require('request');
var sessionCookie;
var username = "abel_c"
var password = "toto42"
require('colors');
var app; // =  superTest('http://localhost:5000')


var testPort = function(port, cb) {
    var url = "http://localhost:" + port;
    superTest(url)
        .get('/ping')
        .end(function(err, res) {
            if (!err) {
                console.log(("    Connected to port " + port).green)
                app = superTest(url);
            }
            cb(!err)
        })
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
                    app = superTest(require(process.cwd() + '/api/app.js'))
                }
                return done();
            })
        })

    });
})


describe('Login', function() {
    it('check api access', function(done) {
        app.get('/api/intervention/12')
            .expect(401, done)
    });

    it('login page redirection', function(done) {
        app.get('/dashboard')
            .expect(302)
            .end(function(err, res) {
                assert((res.text).includes(loginPageSample), 'Not redirected to login page')
                done()
            })
    });
    it('bad username/password', function(done) {
        app.post('/login')
            .field('username', 'lol42')
            .field('password', 'test123')
            .expect(302)
            .end(function(err, res) {
                expect(res.headers.location).to.includes('#failure')
                done()
            })
    });

    it('valid login', function(done) {
        app.post('/login')
            .field('username', username)
            .field('password', password)
            .field('url', '/interventions')
            .expect(302)
            .end(function(err, res) {
                expect(res.headers.location).to.equal('/interventions')
                expect(res.headers['set-cookie']).to.be.an('array').and.not.to.be.empty
                sessionCookie = cookie.parse(res.headers['set-cookie'][0]);
                expect(sessionCookie).to.be.an('object');
                expect(sessionCookie.edison).to.not.be.undefined
                sessionCookie = res.headers['set-cookie'][0]
                done();
            })
    });

    it('who am i', function(done) {
        app.get('/api/whoAmI')
            .set('cookie', sessionCookie)
            .expect(200)
            .end(function(err, res) {
                var resp = JSON.parse(res.text);
                expect(resp.login).to.equal(username);
                done();
            })
    });
});

describe('API', function() {
    describe('DB', function() {
        describe('Interventions', function() {
            it('get /api/intervention/{{id}}', function(done) {
                app.get('/api/intervention/12')
                    .set('cookie', sessionCookie)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        var resp = JSON.parse(res.text);
                        expect(resp._id).to.be.equal(12);
                        done();
                    })
            })
        });
    });
});
describe('Logout', function() {

    it('logout', function(done) {
        app.get('/logout')
            .set('cookie', sessionCookie)
            .expect(302, done)
    });
});
