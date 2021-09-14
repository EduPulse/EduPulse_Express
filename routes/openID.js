const { Router } = require("express");
const passport = require('passport');
const config = require('../config/config');
const auth = require('../modules/auth');
const { userLogin, userLogout } = require('../modules/log');

const router = Router();

router.get('/google', 
    passport.authenticate('google', {
        failureRedirect: config.webRoot + '?error=Failed to sign in'
    })
);

router.get('/google/finish', 
    passport.authenticate('google', {
        failureRedirect: config.webRoot + '?error=Failed to sign in'
    }), 
    function(req, res, next) {
        userLogin(req.user._id);
        res.redirect(config.webRoot + '?signin=true');
    }
);

router.get('/azure', 
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', {
            response: res,
            failureMessage: true,
            // tenantIdOrName: config.clients.azure.tenent,
            failureRedirect: config.webRoot + '?error=Failed to sign in'
        })(req, res, next);
    }
);

router.post('/azure/finish', 
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', {
            response: res, 
            failureMessage: true,
            // tenantIdOrName: config.clients.azure.tenent,
            failureRedirect: config.webRoot + '?error=Failed to sign in'
        })(req, res, next);
    },
    function(req, res, next) {
        userLogin(req.user._id);
        res.redirect(config.webRoot + '?signin=true');
    }
);

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect(config.webRoot + '?signout=true')
});

router.get('/user', 
    auth.assertAuthenticated,
    function (req, res, next) {
        res.send(req.user);
    }
);

module.exports = router;