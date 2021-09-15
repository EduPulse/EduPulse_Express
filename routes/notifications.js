const { Router } = require("express");
const auth = require('../modules/auth');
const notifications = require('../modules/notifications');

const router = Router();

router.get('/push', 
    auth.assertAuthenticated,
    function (req, res, next) {
        notifications.getNotifications(req.user._id, 'push').then( notifs => {
            res.send(notifs);
        }).catch( error => {
            res.sendStatus(500);
        })
    }
);

router.get('/view', 
    auth.assertAuthenticated,
    function (req, res, next) {
        notifications.getNotifications(req.user._id, 'view').then( notifs => {
            res.send(notifs);
        }).catch( error => {
            res.sendStatus(500);
        })
    }
);

router.put('/update', 
    auth.assertAuthenticated,
    function (req, res, next) {
        let ids = req.body;
        notifications.updateNotifications(req.user._id, ids, 'viewed').then( () => {
            res.sendStatus(200);
        }).catch( error => {
            res.sendStatus(500);
        })
    }
);

module.exports = router;