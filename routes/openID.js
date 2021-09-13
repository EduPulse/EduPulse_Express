const { Router } = require("express");
const passport = require('passport');
const config = require('../config/config');

const router = Router();

router.get('/google', passport.authenticate('google'));

router.get('/google/finish', 
    passport.authenticate('google', {failureRedirect: config.applicationRoot}),
    function(req, res, next) {
        res.send(req.user);
    }
)

router.get('/azure', 
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', {
            response: res,
            failureMessage: true,
            // failureRedirect: config.applicationRoot
        })(req, res, next);
    }
)

router.post('/azure/finish', 
    function(req, res, next) {
        passport.authenticate('azuread-openidconnect', {
            response: res, 
            failureMessage: true,
            tenantIdOrName: config.clients.azure.tenent
            // failureRedirect: config.applicationRoot
        })(req, res, next);
    },
    function(req, res, next) {
        res.send(req.user);
    }
)

router.get('/logout', function (req, res, next) {
    req.logout();
    res.redirect(config.applicationRoot)
})

module.exports = router;