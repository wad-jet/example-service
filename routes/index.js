var express = require('express');
var router = express.Router();
var util = require('util');

router.get('/', 
  function(req, res, next) {
    if (util.isNullOrUndefined(req.user))
      return res.redirect('/auth/google');
    next();
  },
  function(req, res, next) {
    res.render('index', { user: req.user, title: 'User profile' });
  });

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;
