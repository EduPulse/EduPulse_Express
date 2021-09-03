var express = require('express');
const User = require('../models/user');
const db = require('../modules/db.js');

var router = express.Router();

router.get('/all', function (req, res, next) {
    User.find({}, function (err, users) {
        if (err) res.send(err);
        res.send(JSON.stringify(users));
    })
});

module.exports = router;