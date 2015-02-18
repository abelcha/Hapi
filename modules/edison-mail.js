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
//	return (this.renderMail(data.content))

var sendgrid = require("sendgrid")("app33756489@heroku.com", "63tqwed2");
var email = new sendgrid.Email();
 
email.addTo("abel.chalier@epitech.eu");
email.setFrom("you@youremail.com");
email.setSubject("Sending with SendGrid is Fun");
email.setHtml("and easy to do anywhere, even with Node.js");
sendgrid.send(email, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
});

	/*var nodemailer = require("nodemailer");
	var smtpTransport = nodemailer.createTransport({
	   service: "Gmail",
	   auth: {
	       user: "jeremie.edison@gmail.com",
	       pass: "edison123456"
	   }
	});

	smtpTransport.sendMail({
	   from: "Edison <intervention@edison-services.fr>", // sender address
	   to: "Abel <abel@chalier.me>", // comma separated list of receivers
	   subject: data.options.title, // Subject line
	   html: this.renderMail(data.content),
	}, function(error, response){
	   if(error){
	   	console.log(error);
	       return(error);
	   }else{
	   	console.log(response);
	       return("Message sent: " + response.message);
	   }
	});*/
}