const express = require('express');
const User = require('../models/user');

let router = express.Router();

router.post('/', function (req, res,next) {
    try {
        let postedData = req.body;
        let userID=postedData._id.toString();
        User.find({_id:userID}).populate('user', '').exec(function(err, posts) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(posts);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;