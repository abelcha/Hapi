
module.exports = {

    renderMailM: function(content) {
        if (content.textFile)
            content.text = npm.fs.readFileSync(__dirname + '/../Emails/Text/' + content.textFile).toString();
        var template = npm.fs.readFileSync(__dirname + '/../Emails/Template/' + content.template + '.ejs', 'utf8');
        return (npm.ejs.render(template, content));
    },

    sendMail: function(data) {
        var client = new npm.postmark.Client("b2c424bc-af2b-4175-b76f-c863bb3915c3");
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
};
