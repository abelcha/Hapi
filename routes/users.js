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

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
   if (err) { return next(err) }
   else if (!user) {
      return res.render('Login/login', info)
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect("/interventions");
    });

  })(req, res, next);
});


app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/interventions');
   }
  else
    res.render('Login/login', {err:''});

});


app.post('/activate', function(req, res) {

var password = new _form('password', req.body);
  password.sanitizeAndValidate(function(results, data) {
    if (results.status == 'OK') {
      _db.userModel.update({_id:data.id}, {password:data.hash, activated:true}, function(err, doc) {
      });
    }
    res.json(results);
  });

});

app.get('/activate/:id', function(req, res) {
    console.log("yay")
  _db.userModel.findOne({_id:req.params.id}, function(err, data) {
    if (!err && data) {
      res.location('back');
      return res.render('Login/activate', {activated:false, data:data});
    }
    else
      return res.redirect('/');
  });

});

app.get('/signup', isLoggedIn, function(req, res) {
  console.log(req.user);
  res.render('Login/signup')
});

app.post('/signup', isLoggedIn, function(req, res) {

	var signup = new _form('signup', req.body);

	signup.sanitizeAndValidate(function(results, data) {
		if (results.status == 'OK') {
			new _db.userModel(data).save(function(e, d) {
				_mail.sendMail({
			      name:"M. " + S(data.nom).capitalize(), 
                  title:"Activation du compte Edison Service", 
                  textFile:"invitation",
                  button:"Activer votre compte",
                  link: `Hello, ${app.get('url')}activate/${d._id}`,
                  template:"messageAndLink",
                  adress:e.email,
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
