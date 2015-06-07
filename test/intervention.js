require("./module/init.js")(true);
var intervention = 123

describe("[Interventions]", function() {
    before(function(done) {
        intervention = require("./module/intervention-utils")(global.app)
        app.get("/api/intervention/12")
            .end(function(err, res) {
                var resp = JSON.parse(res.text);
                inter = resp;
                done();
            })
    })

    describe("Basic OP", function() {
        it("get /api/intervention/12", function(done) {
            app.get("/api/intervention/12")
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text);
                    expect(resp._id).to.be.equal(12);
                    inter = resp;
                    done();
                })
        })
        it("get /api/intervention/123123123", function(done) {
            app.get("/api/intervention/123123123")
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        })


        it("post /api/intervention/{invalid}", function(done) {
                app.post("/api/intervention")
                    .send()
                    .end(function(err, res) {
                        expect(res).to.have.status(400);
                        done();
                    })
            })
            //it("post /api/intervention/{valid}", newInter);
        it("get /api/intervention/{valid}", function(done) {
            intervention.create(function(inter) {
                app.get("/api/intervention/" + inter.id)
                    .end(function(err, res) {
                        expect(res).to.have.status(200);
                        var resp = JSON.parse(res.text);
                        expect(resp.client.prenom).to.be.equalIgnoreCase(inter.client.prenom);
                        expect(resp.login.ajout).to.be.equalIgnoreCase(config.username);
                        global.inter = resp;
                        done();
                    })
            })
        })
    });



    describe("Status Fest ", function() {
        this.timeout(10000);
        it("envoi sans text sms".magenta, function(done) {
            app.post("/api/intervention/" + inter.id + "/envoi")
                .end(function(err, res) {
                    expect(res).to.have.status(400);
                    done();
                })
        })
        it("envoi avec sms".blue, function(done) {
            intervention.envoi(function(res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text);
                expect(resp.status).to.be.equalIgnoreCase("ENV");
                expect(resp.login.envoi).to.be.equalIgnoreCase(config.username);
                done();
            })
        });
        it("second envoi".magenta, function(done) {
            intervention.envoi(function(res) {
                console.log(res.text)
                expect(res).to.have.status(400);
                done();
            })
        });
        it("annulation".blue, function(done) {
            intervention.annulation(function(res) {
                expect(res).to.have.status(200);
                done();
            })
        });
        it("envoi intervention".blue, function(done) {
            intervention.envoi(function(res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text);
                expect(resp.login.envoi).to.be.equalIgnoreCase(config.username);
                expect(resp.status).to.be.equalIgnoreCase("ENV");
                done();
            })
        });
        it("annulation".blue, function(done) {
            intervention.annulation(function(res) {
                expect(res).to.have.status(200);
                done();
            })
        });
        it("suppression artisan".blue, function(done) {
            inter.artisan = null
            intervention.update(inter, function(res) {
                var resp = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(resp.artisan).to.be.null
                done();
            });
        });
        it("envoi intervention".magenta, function(done) {
            intervention.envoi(function(res) {
                expect(res).to.have.status(400);
                done();
            })
        });
        it("ajout artisan".blue, function(done) {
            inter.artisan = config.artisan;
            intervention.update(inter, function(res) {
                var resp = JSON.parse(res.text)
                expect(res).to.have.status(200);
                assert.equal(JSON.stringify(inter.artisan), JSON.stringify(resp.artisan));
                done();
            });
        });
        it("verification".blue, function(done) {
            intervention.verification(function(res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text)
                expect(resp.login.verification).to.be.equalIgnoreCase(config.username);
                expect(resp.status).to.be.equalIgnoreCase("ATT");
                done();
            })
        });
        it("double verification".magenta, function(done) {
            intervention.verification(function(res) {
                expect(res).to.have.status(400);
                done();
            })
        });
        it("annulation".blue, function(done) {
            intervention.annulation(function(res) {
                expect(res).to.have.status(200);
                done();
            })
        });
        it("mode reglement -> facture".blue, function(done) {
            inter.reglementSurPlace = false;
            intervention.update(inter, function(res) {
                var resp = JSON.parse(res.text)
                expect(res).to.have.status(200);
                assert.equal(resp.reglementSurPlace, inter.reglementSurPlace);
                done();
            });
        });
        it("envoi intervention".blue, function(done) {
            intervention.envoi(function(res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text);
                expect(resp.status).to.be.equalIgnoreCase("ENV");
                done();
            })
        });

        it("verification sans facture".magenta, function(done) {
            intervention.verification(function(res) {
                expect(res).to.have.status(400);
                done();
            })
        });
        it("ajout facture".blue, function(done) {
            inter.facture = data.intervention.createFacture()
            intervention.update(inter, function(res) {
                var resp = JSON.parse(res.text)
                expect(res).to.have.status(200);
                expect(JSON.stringify(inter.facture)).to.be.equal(JSON.stringify(resp.facture))
                done();
            });
        });
        it("envoi facture".blue, function(done) {
            intervention.envoiFacture(function(res) {
                expect(res).to.have.status(200);
                done();
            })
        });
        it("verification avec facture".blue, function(done) {
            intervention.verification(function(res) {
                expect(res).to.have.status(200);
                var resp = JSON.parse(res.text)
                expect(resp.status).to.be.equalIgnoreCase("ATT");
                done();
            })
        });
        it("annulation".blue, function(done) {
            intervention.annulation(function(res) {
                expect(res).to.have.status(200);
                done();
            })
        });

    });

    describe("Infos ", function() {
        it("get /intervention/{id} ".blue, function(done) {
            app.get("/api/intervention/" + inter.id)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text)
                    expect(resp._id).to.be.equal(inter.id);
                    done();
                })
        });
        it("get /intervention/{id}/getFiles ".blue, function(done) {
            app.get("/api/intervention/" + inter.id + "/getFiles")
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text)
                    expect(resp).to.be.an('array')
                    done();
                })
        });
        it("get /intervention/stats ".blue, function(done) {
            app.get("/api/intervention/stats")
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text)
                    expect(resp).to.be.an('array')
                    expect(resp[0].total).to.be.an('number');
                    expect(resp[0].montant).to.be.an('number');
                    expect(resp[0].login).to.be.an('string');
                    expect(resp[0].status).to.be.an('object');
                    expect(resp[0].apr).to.be.an('object');
                    done();
                })
        });
    });
});
