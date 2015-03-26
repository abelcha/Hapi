var S = require('string');

module.exports = {};

module.exports.getService = function(str) {
	return {

	};
}

module.exports.renderMail = function(content) {
	var fs = require('fs');
	var ejs = require('ejs');
	if (content.textFile)
		content.text = fs.readFileSync(__dirname + '/../Emails/Text/' + content.textFile).toString();
    var template = fs.readFileSync(__dirname + '/../Emails/Template/' + content.template + '.ejs', 'utf8');
    return (ejs.render(template, content));
}

module.exports.sendMail = function(data) {
//	
var postmark = require("postmark");
var client = new postmark.Client("b2c424bc-af2b-4175-b76f-c863bb3915c3");
client.sendEmail({
    "From": "intervention@edison-services.fr", 
    "To": data.adress, 
    "Subject": data.title, 
    "HtmlBody": this.renderMail(data)
}, function(error, success) {
    if(error) {
        console.error("Unable to send via postmark: " + error.message);
        return;
    }
    console.info("Sent to postmark for delivery")

});
return (this.renderMail(data))

}