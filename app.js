var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')

// auth module
var auth = require('./modules/auth');

// passport configuration
// const passport = require('passport');
// const OpenIDStrategy = require('passport-openid').Strategy;
// passport.use(new OpenIDStrategy({
//   returnURL: 'http://localhost:9000/auth/openid/return',
//   realm: 'http://localhost:9000',
//   profile: true
// }, function (identifier, profile, done) {
//   auth.authenticateUser(identifier, profile, done);
// }));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(passport.initialize());
// app.use(passport.session());

// route handlers
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var regRouter = require('./routes/reg');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var reportsRouter = require('./routes/reports');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/reg', regRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/reports', reportsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
