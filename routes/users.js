var S = require("string");
var _form = require("../modules/form.js")
var _mail = require("../modules/edison-mail.js")


var isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports.routes = function(app, _db, passport, memCache) {

app.post('/', function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/inters',
                                     failureRedirect: '/' })(req, res, next);
});

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/inters');
   }
  else
    res.render('Login/login', { title: 'Express', interList: {} });

});



app.get('/setPassword', isLoggedIn, function(req, res) {
  res.render('/');
});

app.post('/setPassword', function(req, res) {
  res.render('Login/setPassword');
});

app.get('/signup', function(req, res) {
  res.render('Login/signup')
});

app.post('/signup', function(req, res) {

	var signup = new _form('signup', req.body);

	signup.sanitizeAndValidate(function(results, data) {
		if (results.status == 'OK') {
			new _db.userModel(data).save(function(e, d) {
				_mail.sendMail({
			      name:"M. " + S(data.nom).capitalize(), 
                  title:"Activation du compte Edison Service", 
                  textFile:"invitation",
                  button:"Activer votre compte",
                  link:"#signup",
                  template:"messageAndLink",
                  adress:"e.email",
                  service:"Service Informatique",
			      adress:data.email
				});
			});
		}
		res.json(results);

	});
	
});


};
module.exports.isLoggedIn = isLoggedIn;
