
db.artisans.find({}, {id:1, nomSociete:1}).then(function(resp) {
	console.log('-->', resp)
})
