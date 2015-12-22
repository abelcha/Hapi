module.exports = function(app) {


	// catch 404 and forward to error handler
	app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});


	//if (!env_prod) {
	app.use(function(err, req, res, next) {
		__catch(err)
		res.status(err.status || 500);
		res.status(500).json(envProd ? "ERROR" : [err, err.stack]);
		if (envProd) {
			var Convert = require('ansi-to-html');
			var convert = new Convert();
			mail.send({
				noBCC: true,
				From: "intervention@edison-services.fr",
				To: 'abel.chalier@gmail.com',
				Subject: err,
				HtmlBody: "<body style='background:black'>" + convert.toHtml(err.stack.replaceAll('\n', '<br>')) + "</body>",
			});
		}
	});
	//}

}
