const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

var router = express.Router();

router.post('/get_all_publication', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

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


router.post('/delete_post', function (req, res, next) {
    try {
        let postID = req.body.post_id.toString();

        Post.deleteOne({_id: postID}).exec(function (err, result) {
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

router.post('/unpublish_post', function (req, res, next) {
    try {
        let postID = req.body.post_id.toString();

        Post.updateOne({_id: postID}, {"article.status": "unpublished"}).exec(function (err, result) {
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

router.post('/republish_post', function (req, res, next) {
    try {
        let postID = req.body.post_id.toString();

        Post.updateOne({_id: postID}, {"article.status": "published"}).exec(function (err, result) {
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


router.post('/list_followers', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        User.findOne({_id: userID}).select(['-comments', '-collections', '-searchHistory', '-reports']).populate().exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json({followers: result.followedBy});
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/list_following_users', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        User.find({"followedBy": userID}).select(['-comments', '-collections', '-searchHistory', '-reports', '-posts']).populate().exec(function (err, result) {
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

module.exports = router;