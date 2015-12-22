module.exports = function(schema) {

    schema.statics.getFiles = {
        unique: true,
        findBefore: false,
        method: 'GET',
        fn: function(id, req, res) {
            return new Promise(function(resolve, reject) {
                id = parseInt(id);
                if (isNaN(id))
                    return reject("Invalid id")
                document.list('/V2_PRODUCTION/intervention/' + id).then(resolve, function() {
                    resolve([]);
                });

            })
        }
    }
    schema.statics.loadSaveInter = function(req, res) {
        var _ = require('lodash')
        var ids = [37603, 34825, 34269, 33322, 31656, 31593, 31575, 31573, 31569, 31568, 31567, 31529, 31287, 30922, 30921, 30797, 26068, 29816, 29815, 28719, 28460, 28458, 27025, 27023, 27022, 27021, 26399, 26235, 26080, 19313, 14798, 12760, 12353, 12021, 33352, 33024, 31592, 30460, 29847, 29846, 29841, 29840, 29839, 29838, 29837, 28902, 27564, 27562, 27561, 27560, 27456, 27455, 27374, 26770, 26754, 26685, 26524, 26510, 26073, 26059, 26058, 26057, 26056, 26055, 13225, 12644, 12286]
        var id = _.sample(ids)
        console.log('-->', id)
        db.model('intervention').findOne({id:id}).then(function(e) {
            e.save(function(err, resp) {
                console.log('==>', resp.id)
                res.json(resp);
            })
        })
    }

}
