/* const { Router } = require("express");

const router = Router();

// moderator
var reportsRouter = require('./moderator/reports');
router.use('/reports', reportsRouter);
var pendingUsersRouter = require('./moderator/pendingUsers');
router.use('/pending-users', pendingUsersRouter);
var instituteRouter = require('./moderator/institute');
router.use('/institute', instituteRouter);


// admin
var authRouter = require('./auth');
var regRouter = require('./reg');
var usersRouter = require('./users');
var postsRouter = require('./posts');
var accReportsRouter = require('./acc_reports');
var newadRouter = require('./ads');
var manageModeratorRouter = require('./Moderator');
var chartsRouter = require('./charts');
var logsRouter = require('./logs');

router.use('/auth', authRouter);
router.use('/reg', regRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/accreports',accReportsRouter);
router.use('/ad',newadRouter);
router.use('/Moderators',manageModeratorRouter);
router.use('/charts',chartsRouter);
router.use('/savelog',logsRouter);

module.exports = router; */