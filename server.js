var express 		= require("express");
var app 		= express();
var port 		= process.env.PORT || 3000;
var hbs 		= require('hbs');
var passport 		= require('passport');
var flash		= require('flash');
var cookieParser 	= require('cookie-parser');
var session 		= require('express-session');
var bodyParser 	= require('body-parser');
var moment 		= require('moment');
var secretConf		= require('./hidden/secret.js');
var SteamStrategy	= require('passport-steam').Strategy;
var mysql      		= require('mysql');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('assets'));
app.use(cookieParser());
app.use(session({ secret: 'csdbf7sgf89sdgf78sdgf89gsd89fg89sd' } )); 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.localsAsTemplateData(app);

app.locals.name = "DayZ Panel";
app.locals.year = moment().year();

var connection = mysql.createConnection(secretConf.connection);

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3000/auth/steam/return',
    realm: 'http://localhost:3000/',
    apiKey: secretConf.steam.key
  },
  function(identifier, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's Steam profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Steam account with a user record in your database,
      // and return that user instead.
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

/**
 * HBS Helpers
 */
hbs.registerHelper('formatTime', function(oldTime) {
	return new hbs.SafeString(
		moment(oldTime).format("MMMM Do YYYY @ h:mm:ss a")
	);
});

app.get('/', function(req, res) {

	res.render('home/index', {
		user: req.user
	});

});

/** Passport & Authentication Routes  **/
app.get('/login', function(req, res) {

});
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/');
});
app.get('/auth/steam/return', passport.authenticate('steam', { failureRedirect: '/login' }), function(req, res) {
	res.redirect('/');
});


/** Authentication Required Routes **/
app.get('/map', loggedIn, function(req, res) {

	res.render('application/map', {
		user: req.user
	});

});

/**
 * Custom Error Pages
 */
app.get('/404', function(req, res) {
	res.render('application/error', {
		code: 404,
		message: 'The page you are looking for could not be found.'
	});
});
app.get("/401", function(req, res) {
	res.render("application/error", {
		code: 401,
		message: "You are not authorized to access to resource you are requesting. This security incident has been logged."
	});
});

/**
 * 404 error catcher
 */
app.get("*", function(req, res, next) {
	var err = new Error();
	err.status = 404;
	next(err);
});
app.use(function(err, req, res, next) {
	if (err.status !== 404) {
		return next();
	}

	res.redirect("/404");
});

var server = app.listen(port, function() {

	var host = server.address().address

	console.log("Application is running at http://%s:%s", host, port);
});

function loggedIn(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	res.redirect('/login');
}