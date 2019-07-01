var express = require('express');
var router = express.Router();
var user = require('../models/user');

router.get('/levelIncrement/:id', async function(req, res, next) {
	try {
		var result = await user.levelIncrement(req.params.id);
		res.status(200);
		res.json({ level: result });
	} catch (err) {
		next(err);
	}
});

router.get('/levelDecrement/:id', async function(req, res, next) {
	try {
		var result = await user.levelDecrement(req.params.id);
		res.status(200);
		res.json({ level: result });
	} catch (err) {
		next(err);
	}
});

router.get('/ratingIncrement/:id', async function(req, res, next) {
  try {
		var result = await user.ratingIncrement(req.params.id);
		res.status(200);
		res.json({ rating: result });
	} catch (err) {
		next(err);
	}
});

router.get('/ratingDecrement/:id', async function(req, res, next) {
  try {
		var result = await user.ratingDecrement(req.params.id);
		res.status(200);
		res.json({ rating: result });
	} catch (err) {
		next(err);
	}
});

router.get('/findNearestUser/:rating/:level', async function(req, res, next) {
  try {
		var result = await user.findNearestUser(req.user.id, req.params.rating, req.params.level);
		res.status(200);
		res.json(result);
	} catch (err) {
		next(err);
	}
});

module.exports = router;
