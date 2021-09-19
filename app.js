var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var createError = require('http-errors');
var logger = require('morgan');
var cors = require('cors');
const session = require('express-session');
const passport = require('passport');

// boot config
const config = require('./config/config');
const passportConfig = require('./config/passport');

var app = express();

//passport
app.use(session({
  secret: config.sessionSecret,
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(express.static(path.join(__dirname, 'build')));

// open-id
var openIDRouter = require('./routes/openID');
app.use('/openid', openIDRouter);

//api
var APIRouter = require('./routes/API');
app.use('/api', APIRouter);


var indexRouter = require('./routes/index');
app.use('/', indexRouter);

/* app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); */

module.exports = app;
