var express = require('express');
var session = require('express-session'),
    bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');

require('dotenv').config();

var indexRouter = require('./routes/index');
var authGoogleRouter = require('./routes/auth/google');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ 
	secret: "keyboard cat",
	resave: false,
	saveUninitialized: false
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
require('./auth').config();

app.use('/', indexRouter);
app.use('/auth/google', authGoogleRouter);
app.use('/users', usersRouter);

app.use(errorHandler);
function errorHandler(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('error', { error: err });
}

module.exports = app;
