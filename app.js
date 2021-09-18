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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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

// open-id
var openIDRouter = require('./routes/openID');
app.use('/openid', openIDRouter);

//api
var APIRouter = require('./routes/API');
app.use('/api', APIRouter);

//api
/* var APIRouter = require('./routes/API');
app.use('/api', APIRouter); */

// route handlers
var indexRouter = require('./routes/index');
var regRouter = require('./routes/reg');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var accReportsRouter = require('./routes/acc_reports');
var newadRouter = require('./routes/ads');
var manageModeratorRouter = require('./routes/Moderator');
var chartsRouter = require('./routes/charts');
var logsRouter = require('./routes/logs');

const viewArticleRouter = require('./routes/nonRegisteredUser/view_article');
const postCommentRouter = require('./routes/registeredUser/post_comment');
const getUserData=require('./routes/nonRegisteredUser/get_user_data');
const voteForPost=require('./routes/registeredUser/vote_for_post');
const voteForComment=require('./routes/registeredUser/vote_for_comment');
const addToLibrary=require('./routes/registeredUser/add_to_library');
const writeArticle=require('./routes/academicUser/wirte_article');
const tagOperation=require('./routes/nonRegisteredUser/tag_operation');
const searchOperation=require('./routes/nonRegisteredUser/search_operation');
const dashboardOperation=require('./routes/academicUser/dashboard_operation');
const reportOperation=require('./routes/registeredUser/report_operation');
const postVersion=require('./routes/academicUser/post_version');
const getTopAuthors=require('./routes/nonRegisteredUser/get_top_authors')
const pinPost=require('./routes/registeredUser/pin_post');
const homeFunction=require('./routes/nonRegisteredUser/home_function');
const publishMedia=require('./routes/academicUser/publish_media')
var reportsRouter = require('./routes/reports');
var pendingUsersRouter = require('./routes/pendingUsers');
var instituteRouter = require('./routes/institute');

var updateProfile = require('./routes/update_profile');
var loggedInUser = require('./routes/loggedIn_User');
var authorProfile = require('./routes/get_authorProfile');

app.use('/', indexRouter);
app.use('/reg', regRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/accreports',accReportsRouter);
app.use('/ad',newadRouter);
app.use('/Moderators',manageModeratorRouter);
app.use('/charts',chartsRouter);
app.use('/savelog',logsRouter);

app.use('/view_article',viewArticleRouter);
app.use('/post_comment',postCommentRouter);
app.use('/get_user_data',getUserData);
app.use('/vote_for_post',voteForPost);
app.use('/vote_for_comment',voteForComment);
app.use('/add_to_library',addToLibrary);
app.use('/write_article',writeArticle);
app.use('/publish_media',publishMedia);
app.use('/tag_operation',tagOperation);
app.use('/search_operation',searchOperation);
app.use('/dashboard_operation',dashboardOperation);
app.use('/report_operation',reportOperation);
app.use('/post_version',postVersion);
app.use('/pin_post',pinPost);
app.use('/get_top_authors',getTopAuthors);
app.use('/home_function',homeFunction);

// moderator
app.use('/reports', reportsRouter);
app.use('/pending-users', pendingUsersRouter);
app.use('/institute', instituteRouter);

app.use('/update_profile', updateProfile);
app.use('/loggedIn_User', loggedInUser);
app.use('/get_authorProfile', authorProfile);

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
