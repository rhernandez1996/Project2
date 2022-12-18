var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local');
var db = require('./db');

var cookieSession = require('cookie-session');

// Configure the local strategy for use by Passport.
//
// The local strategy requires a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password !=password) {return cb(null, false); }
      return cb(null, user);
    });
  }))


// Configure Passport authenticated session persistence.
// Serialize and deserialize users
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {return cb(err); }
    cb (null, user);
  });
});


// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

//cookie session
app.use(session({
  secret: 'westcliff',
  name: westcliff,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/home', function(req, res) {
  res.render('home', {
    user: req, res });
});
app.get('/home', function(req, res) {
  res.render('home', {
    user: req.user });
});
app.post('/login', //the form submitted itself 
passport.authenticate('local', { failureRedirect: '/login' }),
function(req,res) {
  res.redirect('/');
});
app.get('/logout', 
function(req, res) {
  req.logout();
  res.redirect('/');
  req.logout();
  res.clearCookie('connect.sid');
});





app.listen(3000);
