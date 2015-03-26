var S = require("string");

var isLoggedIn = function(req, res, next) {
  //  if (req.app.get('env') === 'development' )
      return next();
    /*else*/ if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}


module.exports.routes = function() {

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.post('/', function(req, res, next) {
  npm.passport.authenticate('local', function(err, user, info) {
   if (err) { return next(err) }
   else if (!user) {
      return res.render('Login/login', info)
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      req.session.user = info;
      return res.redirect("/");
    });

  })(req, res, next);
});


app.get('/', function(req, res) {

if (req.isAuthenticated()) {
    if (req.session.passport.user.service == "118000")
      return res.redirect("/118")
    else
      res.redirect('/interventions');
   }
  else
    res.render('Login/login', {err:''});

});


app.post('/activate', function(req, res) {

var password = new edison.form('password', req.body);
  password.sanitizeAndValidate(function(results, data) {
    if (results.status == 'OK') {
      _db.userModel.update({_id:data.id}, {password:data.hash, activated:true}, function(err, doc) {
      });
    }
    res.json(results);
  });

});

app.get('/activate/:id', function(req, res) {
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

	var signup = new edison.form('signup', req.body);
	signup.sanitizeAndValidate(function(results, data) {
		if (results.status == 'OK') {
			new _db.userModel(data).save(function(e, d) {
        edison.mail.sendMail({
			      name:"M. " + S(data.nom).capitalize(), 
                  title:"Activation du compte Edison Service", 
                  textFile:"invitation",
                  button:"Activer votre compte",
                  link: app.get('url') + "activate/" + d._id,
                  template:"messageAndLink",
                  adress:d.email,
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
