module.exports = {

    intervention: {
        createFacture: function(options) {
            var faker = require('faker');
            var _ = require('lodash');
            var edconfig = require(process.cwd() + '/server/edison_components/config.js')
            faker.locale = "fr";
            return {
                tva: _.random(2) ? 20 : 0,
                email: faker.internet.email(),
                tel: faker.phone.phoneNumber(),
                address: {
                    n: _.random(100),
                    r: 'allée ' + faker.address.streetName(),
                    cp: faker.address.zipCode(),
                    v: faker.address.city(),
                    lt: faker.address.latitude(),
                    lg: faker.address.longitude()
                },
                prenom: faker.name.firstName(),
                nom: faker.name.lastName(),
                type: edconfig.typePayeur[_.random(5)].short_name
            }
        },
        createValid: function(options) {
            var faker = require('faker');
            var _ = require('lodash');
            var edconfig = require(process.cwd() + '/server/edison_components/config.js')
            faker.locale = "fr";
            var rtn = {
                client: {
                    civilite: edconfig.civilitesTab[_.random(2)],
                    prenom: faker.name.firstName(),
                    nom: faker.name.lastName(),
                    address: {
                        n: _.random(100),
                        r: 'rue ' + faker.address.streetName(),
                        cp: faker.address.zipCode(),
                        v: faker.address.city(),
                        lt: faker.address.latitude(),
                        lg: faker.address.longitude()
                    },
                    telephone: {
                        tel1: faker.phone.phoneNumber()
                    }
                },
                categorie: edconfig.categoriesAKV[_.random(6)].s,
                description: faker.lorem.sentence(),
                modeReglement: edconfig.modeDeReglements[_.random(2)].short_name,
            }
            if (options && options.artisan)
                rtn.artisan = config.artisan
            return rtn;
        }
    }

}
