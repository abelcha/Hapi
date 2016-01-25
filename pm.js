//52.41
var superagent = require('superagent')
var getMessageDetails = function(messageID, done) {
	superagent.get('https://api.postmarkapp.com/messages/outbound/' + messageID + '/details')
		.set("X-Postmark-Server-Token", "b2c424bc-af2b-4175-b76f-c863bb3915c3")
		.accept("application/json")
		.end(function(err, resp) {
			if (err) {
				done(err)
			}
			done(resp.body)
		})

}

getMessageDetails("4b755242-5514-4786-9666-ee99a27a808b", function(err, resp) {
	console.log(err, resp)
})
