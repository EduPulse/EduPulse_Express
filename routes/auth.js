var express = require('express');
var jwt_decode = require('jwt-decode');
const User = require('../models/user');
const auth = require('../modules/auth');
// const passport = require('passport');

var router = express.Router();

router.post('/openid', function(req, res, next) {
  try {
    var jwt = req.query.openid_identifier;
    var userInfo = jwt_decode(jwt);

    auth.authenticateUser(userInfo.email).then(user => {
      console.log(`logging in user ${user.personalEmail}`)
      res.json({
        name: user.name,
        personalEmail: user.personalEmail,
        role: user.role,
        profilePicture: user.profilePicture,
        _id: user._id
      });
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(403);
  }
});

// router.post('/openid', passport.authenticate('openid'));

// router.get('/openid/return', passport.authenticate('openid', {failureRedirect: '/login'}, {
//   function (req, res) {
//     console.log('authenticated user');
//     res.send('authenticated');
//   }
// }));

module.exports = router;