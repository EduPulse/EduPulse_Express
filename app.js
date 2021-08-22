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


var viewArticleRouter = require('./routes/view_article');
var postCommentRouter = require('./routes/post_comment');
var getUserData=require('./routes/get_user_data');
var voteForPost=require('./routes/vote_for_post');
var voteForComment=require('./routes/vote_for_comment');
var addToLibrary=require('./routes/add_to_library');
var writeArticle=require('./routes/wirte_article');
var tagOperation=require('./routes/tag_operation');
var searchOperation=require('./routes/search_operation');
var dashboardOperation=require('./routes/dashboard_operation');
var reportOperation=require('./routes/report_operation');
var postVersion=require('./routes/post_version');
var pinPost=require('./routes/pin_post')

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/reg', regRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.use('/view_article',viewArticleRouter);
app.use('/post_comment',postCommentRouter);
app.use('/get_user_data',getUserData);
app.use('/vote_for_post',voteForPost);
app.use('/vote_for_comment',voteForComment);
app.use('/add_to_library',addToLibrary);
app.use('/write_article',writeArticle);
app.use('/tag_operation',tagOperation);
app.use('/search_operation',searchOperation);
app.use('/dashboard_operation',dashboardOperation);
app.use('/report_operation',reportOperation);
app.use('/post_version',postVersion);
app.use('/pin_post',pinPost);

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
