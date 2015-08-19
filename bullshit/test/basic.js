require("./module/init.js")(false)

describe('Static files', function() {
    it('get /css/style.css', function(done) {
        app.get('/css/style.css')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'text/css; charset=UTF-8');
                done();
            })
    });
    it('get /dist/all.js', function(done) {
        app.get('/dist/all.js')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'application/javascript');
                done();
            })
    });
});

describe('Login', function() {
    it('logout', function(done) {
        app.get('/logout')
            .end(function(err, res) {
                expect(res.redirects).to.be.an('array').and.not.to.be.empty
                done();
            })
    });
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
                assert((res.text).includes(config.loginPageSample), 'Not redirected to login page')
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
                username: config.username,
                password: config.password,
                url: '/test123'
            })
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res.redirects[0]).to.endsWith('/test123')
                expect(res.req).to.have.cookie('EDISON-SESSION');
                done();
            })
    });

    it('who am i', function(done) {
        app.get('/api/whoAmI')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text);
                expect(resp.login).to.equal(config.username);
                done();
            })
    });
});
