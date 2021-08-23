const express = require('express');
const User = require('../models/user');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let userData = req.body;
        let userID = userData._id.toString();
        User.findOne({_id: userID}).populate('').exec(function(err, result) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;