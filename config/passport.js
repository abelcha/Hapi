
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {


	/*  AUTHENTIFICATION */

	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(user, done) {
	  done(null, user);
	});

	passport.use(new LocalStrategy(
	  function(username, password, done) {
	  	var mongoose = require('mongoose');
	   if (username == "abel" && password == "123") {
	     return done(null, {toto:"abel", lol:42});
	   }
	    return done(null, false);
	  }
	));

	return {
	    secret: '15c5p03q5Bn91B8k9O5C32gX8onx9p',
	    name: 'EDISON-SESSION',
	    resave: true,
	    saveUninitialized: true
	}


};