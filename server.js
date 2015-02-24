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
var http		= require('http');
var validator 		= require('validator');
var morgan 		= require('morgan');
var fs 			= require('fs');
var txt			= require('./helpers/text.js');

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('assets'));
app.use(cookieParser());
app.use(session({ secret: secretConf.session.key } )); 
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(morgan('short', {stream: accessLogStream}));
app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.localsAsTemplateData(app);

/** Variables and Stuff **/
app.locals.name = "DayZ Panel";
app.locals.year = moment().year();
var Staff = Array(
	76561198020571124, // Teddy
	76561197983293052 // Chase
);

var connection = mysql.createConnection(secretConf.connection);
connection.connect(function(err) {
	if (err) {
		console.log("Couldn't connect to " + secretConf.connection.host + ": " + err.message);
		console.log("Application will exit as a MySQL database connection is required.");
		process.exit();
	} else {
		console.log("MySQL Database connection established to " + secretConf.connection.host + ".");
	}
});

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
    process.nextTick(function () {
      profile.identifier = identifier;
      return done(null, profile);
    });
  }
));

/** 
 * Runtime Error Handlers
 */
connection.on('error', function(err) {
	if (err.code == 'PROTOCOL_CONNECTION_LOST') {
		console.log("Database connection was lost. Process will abort.");
		process.exit();
	} else if (err.code == 'ECONNREFUSED') {
		console.log("Database refused connectivity. Process will abort.");
		process.exit();
	}
	console.log("[Query] Error(" + err.code + "): " + err.message);
});

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
	res.render('application/login', {
		user: req.user
	});
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

/** Player Search Algorithm Routes */
app.get('/players/find/basic', function(req, res) {
	res.render('search/basic', {
		user: req.user
	});
});
app.get('/players/find/advanced', function(req, res) {
	res.render('search/advanced', {
		user: req.user
	});
});
app.post('/search/basic', function(req, res){
	console.log("REDIRECT" + '/players/find/name/' + req.body.val);
	res.redirect('/players/find/name/' + req.body.val);
});
app.post('/search/advanced', function(req, res) {
	console.log("REDIRECT "+ '/players/find/' + req.body.object + '/' + req.body.condition + '/' + req.body.val);
	res.redirect('/players/find/' + req.body.object + '/' + req.body.condition + '/' + req.body.val);
});
app.get('/player/:id', function(req, res) {
	http.get("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" + secretConf.steam.key + "&steamids=" + req.params.id, function(reply) {
		reply.on('data', function(data){
			var jData = JSON.parse(data);
			connection.query("SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Character_DATA.LastLogin as LastLogin, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Character_DATA.Alive = 1 AND Player_DATA.PlayerUID = " + connection.escape(req.params.id), function(err, rows) {
				res.render('player/player', {
					player: jData,
					db: rows[0],
					user: req.user
				});
			});
		});
		reply.on('error', function(err) {
			res.render('application/error', {
				code: 500,
				message: txt.errors.error
			});
		});
	});
});
app.get('/players/find/name/:name', function(req, res) {
	connection.query("SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Character_DATA.Alive = 1 AND Player_DATA.PlayerName LIKE " + connection.escape("%" + req.params.name + "%") + ";", function(err, rows){
		if (err) {
			console.log("Query Error: " + err);
			res.render('application/error', {
				code: 500,
				message: txt.errors.error
			});
		} else {
			res.render('player/players', {
				players: rows,
				user: req.user
			});
		}
	});

});
app.get('/players/find/humanity/:md/:humanity/', function(req, res){
	if (validator.equals(req.params.md, 'g')||validator.equals(req.params.md, 'greater')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Humanity > ' + connection.escape(req.params.humanity) + ' AND Alive = 1 ORDER BY Humanity DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else if (validator.equals(req.params.md, 'l')||validator.equals(req.params.md, 'less')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE Humanity < ' + connection.escape(req.params.humanity) + ' AND Alive = 1 ORDER BY Humanity ASC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else {
		res.redirect('/players/find/advanced');
	}

});
app.get('/players/find/murders/:md/:kills', function(req, res){
	if (validator.equals(req.params.md, 'g')||validator.equals(req.params.md, 'greater')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsH > ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsH DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else if (validator.equals(req.params.md, 'l')||validator.equals(req.params.md, 'less')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsH < ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsH DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else {
		res.redirect('/players/find/advanced');
	}
});
app.get('/players/find/bandits/:md/:kills', function(req, res) {
	if (validator.equals(req.params.md, 'g')||validator.equals(req.params.md, 'greater')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsB > ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsB DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else if (validator.equals(req.params.md, 'l')||validator.equals(req.params.md, 'less')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsB < ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsB DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	}
});
app.get('/players/find/zombies/:md/:kills', function(req, res) {
	if (validator.equals(req.params.md, 'g')||validator.equals(req.params.md, 'greater')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsZ > ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsZ DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	} else if (validator.equals(req.params.md, 'l')||validator.equals(req.params.md, 'less')) {
		connection.query('SELECT Character_DATA.PlayerUID as PlayerUID, Character_DATA.KillsH as Murders, Character_DATA.KillsB as Bandits, Character_DATA.KillsZ as Zombies, Character_DATA.Humanity as Humanity, Player_DATA.PlayerName as Name FROM Character_DATA LEFT JOIN Player_DATA ON (Character_DATA.PlayerUID = Player_DATA.PlayerUID) WHERE KillsZ < ' + connection.escape(req.params.kills) + ' AND Alive = 1 ORDER BY KillsZ DESC LIMIT 50;', function(err, rows) {
			if (err) {
				console.log("Query Error: " + err);
				res.render('application/error', {
					code: 500,
					message: txt.errors.error
				});
			} else {
				res.render('player/players', {
					players: rows,
					user: req.user
				});
			}
		});
	}
});

/** Authentication Required Routes **/
app.get('/map', loggedIn, function(req, res) {

	res.render('application/map', {
		user: req.user
	});

});
app.get('/clans', loggedIn, function(req, res) {

	connection.query("SELECT Player_DATA.PlayerName as PlayerName, clans.Name as ClanName, clans.id as ClanID, Player_DATA.PlayerUID as PlayerUID FROM clans LEFT JOIN Player_DATA ON (clans.FounderUID = Player_DATA.PlayerUID)", function(err, rows){
		if (err) {
			console.log("Query Error: " + err);
			res.render('application/error', {
				code: 500,
				message: txt.errors.error
			});
		} else {
			res.render('clans/clans', {
				clans: rows,
				user: req.user
			});
		}
	});

});

/**
 * Custom Error Pages
 */
app.get('/404', function(req, res) {
	res.render('application/error', {
		code: 404,
		message: txt.errors.notfound
	});
});
app.get("/401", function(req, res) {
	res.render("application/error", {
		code: 401,
		message: txt.errors.forbidden
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

function isSiteStaff(req, res, next) {
	if (req.isAuthenticated) {
		if (validator.isin(req.user._json.response.players.steamid, Staff)) {
			return next();
		}
	}
	res.redirect('/401');
}