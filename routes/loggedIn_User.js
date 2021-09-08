const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let userData = req.body;
        let userID = userData._id.toString();

        console.log("Logged in user ");
        console.log(userID);

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

router.post('/get_all_publication', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user post: ");
        console.log(userID);

        Post.find({author: userID}).populate("pin.originalPost", "").exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_all_tags', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user tags: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.followingTags);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_followingUsers', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user following users: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.following);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_followedBy', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user followed by: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.followedBy);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;
