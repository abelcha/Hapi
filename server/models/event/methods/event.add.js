module.exports = function(schema) {
    schema.statics.list = function(req, res) {
    	console.log(db)
        db.model('event').find({}, {
            data: 0,
            _id: 0
        }).then(function(docs) {
        	res.json(docs)
        })
    }

}
