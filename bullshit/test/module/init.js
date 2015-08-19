module.exports = function(login) {
    global.faker = require('faker');
    global.request = require('request');
    require('colors');
    global._ = require('lodash')
    global.chai = require("chai");
    chai.should();
    chai.use(require('chai-http'));
    chai.use(require('chai-string'));
    global.assert = chai.assert;
    global.expect = chai.expect;
    global.data = require("./data.js")
    global.config = require("./config.js")

    before(function(done) {
        var url = "http://localhost:8080";
        chai.request(url)
            .get('/ping')
            .end(function(err, res) {
                if (!err) {
                    console.log(("    Connected to port 8080").green)
                    global.app = chai.request.agent(url);
                } else {
                    global.app = chai.request.agent(require(process.cwd() + '/server/app.js'))
                }
                if (login === false)
                return done() 
                app.post('/login')
                    .send({
                        username: config.username,
                        password: config.password,
                        url: '/test123'
                    })
                    .end(function(err, res) {
                        done();
                    })
            })
    })
}
