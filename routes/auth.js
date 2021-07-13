var express = require('express');
var jwt_decode = require('jwt-decode');
const auth = require('../modules/auth');
// const passport = require('passport');

var router = express.Router();

router.get('/', function(req, res, next) {
  auth.getAllUsers().then(users => {
    res.send(users);
  }).catch(err => {
    res.send(err);
  });
});

router.post('/openid', function(req, res, next) {
  try {
    var jwt = req.query.openid_identifier;
    var userInfo = jwt_decode(jwt);

    auth.authenticateUser(userInfo.email).then(user => {
      res.json({
        name: user.name,
        personalEmail: user.personalEmail,
        role: user.role,
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