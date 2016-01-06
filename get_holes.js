require('./server/shared.js')();
var _ =require('lodash')
db.model('intervention').find({},{_id:1}).then(function(resp) {
	_.times(38298, function(k) {
		if (!_.find(resp, '_id', k)) {
			console.log(k)
		}
	})
})