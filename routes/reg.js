var express = require('express');
const User = require('../models/user');
const db = require('../modules/db.js');

var router = express.Router();

router.get('/', function (req, res, next) {
    let newUser = new User({
        name: "Chathura Wanniarachchi",
        personalEmail: "wchathuraj@gmail.com",
        role: "academic"
    });

    db.then(
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('saved');
                res.send('saved');
            }
        })
    );
});

module.exports = router;