var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var config = require('config');

passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:' + config.app.port + '/auth/google/return',
        realm: 'http://localhost:' + config.app.port
    },
    function(identifier, profile, done) {
        console.log('passport-google', arguments);
        done(null, {});
//        User.findOrCreate({ openId: identifier }, function(err, user) {
//            done(err, user);
//        });
    }
));

module.exports = passport;


//////// for index.js

var passport = require('./lib/auth');

//app.use(passport.initialize())

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
app.get('/auth/google/return',
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' }));
