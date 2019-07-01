var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/',
  passport.authenticate('google', { scope: [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email' ] }));

router.get('/callback', 
  passport.authenticate('google', { successRedirect: '/', failureRedirect: '/auth/google' }));

module.exports = router;