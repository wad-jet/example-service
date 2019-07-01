var express = require('express');
var router = express.Router();
var user = require('../models/user');
var util = require('util');

function checkAuth(req, res, next) {
	if (util.isNullOrUndefined(req.user)) {
		res.status(401);
		return res.send('');
	}
	next();
}

router.get('/levelIncrement', checkAuth, async function(req, res, next) {	
	try {
		var result = await user.levelIncrement(req.user.id);
		res.status(200);
		res.json({ level: result });
	} catch (err) {
		next(err);
	}
});

router.get('/levelDecrement', checkAuth, async function(req, res, next) {
	try {
		var result = await user.levelDecrement(req.user.id);
		res.status(200);
		res.json({ level: result });
	} catch (err) {
		next(err);
	}
});

router.get('/ratingIncrement', checkAuth, async function(req, res, next) {
  try {
		var result = await user.ratingIncrement(req.user.id);
		res.status(200);
		res.json({ rating: result });
	} catch (err) {
		next(err);
	}
});

router.get('/ratingDecrement', checkAuth, async function(req, res, next) {
  try {
		var result = await user.ratingDecrement(req.user.id);
		res.status(200);
		res.json({ rating: result });
	} catch (err) {
		next(err);
	}
});

router.get('/findNearestUser/:rating/:level', checkAuth, async function(req, res, next) {
  try {
		var result = await user.findNearestUser(req.user.id, req.params.rating, req.params.level);
		res.status(200);
		res.json(result);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
