    var telepro = ['boukris_b', 'taieb', 'harald', "eliran", "jeremie"];
    req.app.get("schemaDB").interventionModel.aggregate([
              {$match: {ajoutePar : {$in: telepro}}}, 
              {$group: { _id: {telepro:'$ajoutePar', etat:'$etatInter'}, result: { $sum: 1 } }},  
              {$project: {_id: "$_id.telepro",obj :{etat:"$_id.etat", count : "$result" }}}   
    ], function (err, data) {
        if (err) {
            res.json(err);
            return;
        }
        console.log(data);
        res.json(data);
    });


