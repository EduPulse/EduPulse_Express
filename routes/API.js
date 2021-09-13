const { Router } = require("express");

const router = Router();

// moderator
var reportsRouter = require('./moderator/reports');
router.use('/reports', reportsRouter);
var pendingUsersRouter = require('./moderator/pendingUsers');
router.use('/pending-users', pendingUsersRouter);
var instituteRouter = require('./moderator/institute');
router.use('/institute', instituteRouter);

module.exports = router;