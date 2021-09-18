const { Router } = require("express");

const router = Router();

// any user
var notificationRouter = require('./notifications');
router.use('/notifications', notificationRouter);

// moderator only
var reportsRouter = require('./moderator/reports');
router.use('/reports', reportsRouter);
var pendingUsersRouter = require('./moderator/pendingUsers');
router.use('/pending-users', pendingUsersRouter);
var instituteRouter = require('./moderator/institute');
router.use('/institute', instituteRouter);

// academic user stuff
const viewArticleRoute = require('./nonRegisteredUser/view_article');
const postCommentRoute = require('./registeredUser/post_comment');
const getUserData=require('./nonRegisteredUser/get_user_data');
const voteForPost=require('./registeredUser/vote_for_post');
const voteForComment=require('./registeredUser/vote_for_comment');
const addToLibrary=require('./registeredUser/add_to_library');
const writeArticle=require('./academicUser/wirte_article');
const tagOperation=require('./nonRegisteredUser/tag_operation');
const searchOperation=require('./nonRegisteredUser/search_operation');
const dashboardOperation=require('./academicUser/dashboard_operation');
const reportOperation=require('./registeredUser/report_operation');
const postVersion=require('./academicUser/post_version');
const getTopAuthors=require('./nonRegisteredUser/get_top_authors')
const pinPost=require('./registeredUser/pin_post');
const homeFunction=require('./nonRegisteredUser/home_function');
const publishMedia=require('./academicUser/publish_media');

router.use('/view_article',viewArticleRoute);
router.use('/post_comment',postCommentRoute);
router.use('/get_user_data',getUserData);
router.use('/vote_for_post',voteForPost);
router.use('/vote_for_comment',voteForComment);
router.use('/add_to_library',addToLibrary);
router.use('/write_article',writeArticle);
router.use('/publish_media',publishMedia);
router.use('/tag_operation',tagOperation);
router.use('/search_operation',searchOperation);
router.use('/dashboard_operation',dashboardOperation);
router.use('/report_operation',reportOperation);
router.use('/post_version',postVersion);
router.use('/pin_post',pinPost);
router.use('/get_top_authors',getTopAuthors);
router.use('/home_function',homeFunction);

// admin
var regRouter = require('./reg');
var usersRouter = require('./users');
var postsRouter = require('./posts');
var accReportsRouter = require('./acc_reports');
var newadRouter = require('./ads');
var manageModeratorRouter = require('./Moderator');
var chartsRouter = require('./charts');
var logsRouter = require('./logs');

router.use('/reg', regRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/accreports',accReportsRouter);
router.use('/ad',newadRouter);
router.use('/Moderators',manageModeratorRouter);
router.use('/charts',chartsRouter);
router.use('/savelog',logsRouter);

module.exports = router;


