const { Router } = require("express");
const passport = require('passport');
const config = require('../config/config');
const auth = require('../modules/auth');
const { userLogin, userLogout } = require('../modules/log');

const router = Router();

router.get('/google', 
    (req, res, next) => {
        if(req.user) {
            res.redirect(config.webRoot + '?signin=true');
        } else {
            return next();
        }
    },
    passport.authenticate('google', {
        failureRedirect: config.webRoot + '?error=Failed to sign in'
    })
);

router.get('/google/finish', 
    passport.authenticate('google', {
        failureRedirect: config.webRoot + '?error=Failed to sign in'
    }), 
    function(req, res, next) {
        userLogin(req.user.role +' '+ req.user._id);
        res.redirect(config.webRoot + '?signin=true');
    }
);

router.get('/azure', 
    (req, res, next) => {
        if(req.user) {
            res.redirect(config.webRoot + '?signin=true');
        } else {
            return next();
        }
    },
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
        userLogin(req.user.role +' '+ req.user._id);
        res.redirect(config.webRoot + '?signin=true');
    }
);

router.get('/logout', 
    auth.assertAuthenticated,
    function (req, res, next) {
        userLogout(req.user.role +' '+ req.user._id);
        req.logout();
        res.redirect(config.webRoot + '?signout=true');
    }
);

router.get('/user', 
    auth.assertAuthenticated,
    function (req, res, next) {
        res.send(req.user);
    }
);

module.exports = router;