global.requireLocal = function(pth) {
	return require(process.cwd() + '/' + pth)
}

var request = require('request');
process.env.MONGOLAB_URI = "mongodb://heroku_app33756489:hrkm1jfvok3i2hsopg9t99jvvd@ds041981-a0.mongolab.com:41981/heroku_app33756489"

var db = require(process.cwd() + '/server/edison_components/db.js')()
var v1 = require(process.cwd() + '/server/edison_components/V1.js')
var _ = require('lodash');
var moment = require('moment')
var async = require('async')


db.model('artisan').find({
	$where: 'this.historique.pack && this.historique.pack.length'
}).select('historique').lean().then(function(resp) {
	_.each(resp, function(e) {
			if (e.historique.pack[0].text) {
				var r = e.historique.pack[0].text
				var sp = r.split('/')
				if (sp.length == 2) {
					sp.push('2015')
				}
				if (sp.length === 3) {
					var sp1 = sp[1]
					sp[1] = _.padLeft(sp[0], 2, '0')
					sp[0] = _.padLeft(sp1, 2, '0')

					var z = moment(sp.join('/')).add(10, 'hours').toDate()
					console.log(e.historique.pack[0].date, "db.artisans.update({id:" + e._id + "}, {$set:{'e.historique.pack[0].date':'" + z + "'}});")
				}
			}
			//console.log('->', e.historique.pack[0].text)
		})
		/*	d.num_facturier.length == 10 ? moment(d.num_facturier).toDate() : new Date
			console.log(resp)*/
	process.exit()
})
