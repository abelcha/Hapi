var cursor = db.interventions.find({status:{$in:['ANN', 'ENC']}, id:{$gt:20000}},{'client.address.lt':1, 'client.address.lg':1, status:1});
    while (cursor.hasNext()) {
	print(JSON.stringify(cursor.next()), ',')
    }