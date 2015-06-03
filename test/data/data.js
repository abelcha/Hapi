module.exports = {

    intervention: {
        createValid: function(options) {
            var faker = require('faker');
            var _ = require('lodash');
            var config = require(process.cwd() + '/server/edison_components/config.js')
            faker.locale = "fr";
            var rtn = {
                client: {
                    civilite: config.civilitesTab[_.random(2)],
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
                },
                categorie: config.categoriesAKV[_.random(6)].s,
                description: faker.lorem.sentence(),
                modeReglement: config.modeDeReglements[_.random(2)].short_name
            }
            if (options && options.artisan)
                rtn.artisan = {
                    id: 7,
                    nomSociete: 'COSTANTINO'
                }
            return rtn;
        }
    }

}
