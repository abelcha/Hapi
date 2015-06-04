/*require("./module/init.js")(true);
var intervention = 123

describe("[Interventions]", function() {
    this.timeout(10000);
    before(function(done) {
        intervention = require("./module/intervention-utils")(global.app)
        done();
    })

    it("get /api/intervention/{valid}", function(done) {
        intervention.create(function(inter) {
            app.get("/api/intervention/" + inter.id)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text);
                    expect(resp.client.prenom).to.be.equalIgnoreCase(inter.client.prenom);
                    expect(resp.login.ajout).to.be.equalIgnoreCase(config.username);
                    global.inter = resp;
                    console.log(resp.id)
                    done();
                })
        })
    })
});
*/