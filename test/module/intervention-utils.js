module.exports = function(app, config) {
    var config = require("./config.js")
    return {
        create: function(options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = undefined;
            }
            global.fakeData = data.intervention.createValid({
                artisan: !options || options.artisan
            });
            app.post('/api/intervention')
                .send(fakeData)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    var resp = JSON.parse(res.text);
                    expect(resp.client.nom).to.be.equalIgnoreCase(fakeData.client.nom);
                    expect(resp.client.prenom).to.be.equalIgnoreCase(fakeData.client.prenom);
                    cb(resp);
                })
        },
        envoi: function(cb) {
            app.post('/api/intervention/' + inter.id + '/envoi')
                .send({
                    sms: faker.lorem.sentences()
                })
                .end(function(err, res) {
                    cb(res);
                })
        },
        annulation: function(cb) {
            app.post('/api/intervention/' + inter.id + '/annulation')
                .end(function(err, res) {
                    cb(res);
                })
        },
        verification: function(cb) {
            app.post('/api/intervention/' + inter.id + '/verification')
                .end(function(err, res) {
                    cb(res);
                })
        },
        update: function(data, cb) {
            app.post('/api/intervention/')
                .send(data)
                .end(function(err, res) {
                    cb(res);
                });
        },
        envoiFacture: function(cb) {
            app.post('/api/intervention/' + inter.id + '/envoiFacture')
                .end(function(err, res) {
                    cb(res);
                });
        }
    }
}
