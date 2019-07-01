var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('./models/user');

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(profile)
        .then(user => done(null, user))
        .catch(err => done(err));
  }
);

const configurator = {
  config: function() {
    passport.use(strategy);
    
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
      User.findById(id, 'google')
        .then(user => {
          return done(null, user); 
        })
        .catch(err => done(err));
    });    
  }
};

module.exports = configurator;