//require("./module/init.js")()


/*
var newInter = function(done) {
    g.fakeData = data.intervention.createValid({
        artisan: true
    });
    app.post('/api/intervention')
        .send(g.fakeData)
        .end(function(err, res) {
            expect(res).to.have.status(200);
            var resp = JSON.parse(res.text);
            expect(resp.client.nom).to.be.equalIgnoreCase(g.fakeData.client.nom);
            g.id = resp.id;
            done();
        })
};

var interEnvoi = function(done) {
    app.get('/api/intervention/' + g.id + '/envoi')
        .send({
            sms: faker.lorem.sentences()
        })
        .end(function(err, res) {
            expect(res).to.have.status(200);
            var resp = JSON.parse(res.text);
            expect(resp.status).to.be.equalIgnoreCase("ENV");
            expect(resp.login.envoi).to.be.equalIgnoreCase(g.username);
            done();
        })
}




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
                assert((res.text).includes(g.loginPageSample), 'Not redirected to login page')
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
                it('post /api/intervention/{valid}', newInter);
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
            describe('Envoi', function() {
                this.timeout(60000);
                if (g.id === 12) {
                    it('post /api/intervention/{valid}', newInter);
                }
                it('get /api/intervention/{valid}/envoi (no smsText)', function(done) {
                    app.get('/api/intervention/' + g.id + '/envoi')
                        .end(function(err, res) {
                            expect(res).to.have.status(400);
                            done();
                        })
                })
                it('get /api/intervention/{valid}/envoi OK', interEnvoi)
            });

            describe('Verification', function() {
                this.timeout(60000);
                if (g.id === 12) {
                    it('post /api/intervention/{valid}', newInter);
                    it('post /api/intervention/{valid}/envoi', interEnvoi);
                }
                it('get /api/intervention/{valid}/verification', function(done) {
                    app.post('/api/intervention/' + g.id + '/verification')
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            var resp = JSON.parse(res.text);
                            expect(resp.status).to.be.equalIgnoreCase("ATT");
                            expect(resp.login.verification).to.be.equalIgnoreCase(g.username);
                            done();
                        })
                })
            });
            describe('Annulation', function() {
                if (g.id === 12) {
                    it('post /api/intervention/{valid}', newInter);
                    it('post /api/intervention/{valid}/envoi', interEnvoi);
                }
                it('get /api/intervention/{valid}/annulation', function(done) {
                    app.post('/api/intervention/' + g.id + '/annulation')
                        .end(function(err, res) {
                            expect(res).to.have.status(200);
                            var resp = JSON.parse(res.text);
                            expect(resp.status).to.be.equalIgnoreCase("ATT");
                            expect(resp.login.annulation).to.be.equalIgnoreCase(g.username);
                            done();
                        })
                })
            });
        });
    });
});
*/
