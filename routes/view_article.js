const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData._id.toString();
        let visibility = postData.visibility.toString();
        let filer = {}
        if (visibility === "Anyone")
            filer = {_id: postID, $or: [{visibility: "Anyone"}], "article.status": "published"};
        else if (visibility === "Academics Only")
            filer = {
                _id: postID,
                $or: [{visibility: "Anyone"}, {visibility: "Academics Only"}],
                "article.status": "published"
            };
        Post.findOne(filer).populate('tags author academicInstitute', '').exec(function (err, result) {
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

router.post('/preview_article', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData._id.toString();
        Post.findOne({_id: postID}).populate('author tags').exec(function (err, result) {
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

router.post('/list_latest_posts', function (req, res, next) {
    try {
        let postData = req.body;
        let userID = postData.user_ID.toString();
        let postID = postData.post_ID.toString();
        Post.find({$and: [{author: {$in: userID}}, {_id: {$ne: postID}}, {"article.status": "published"}]}).limit(5).populate('post', 'article').exec(function (err, result) {
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

router.post('/follow_writer', function (req, res, next) {
    try {
        let postData = req.body;
        let userID = postData.user_ID.toString();
        let writerID = postData.writer_ID.toString();
        User.updateOne({_id: writerID}, {$addToSet: {followedBy: {_id: userID}}}).limit(5).populate('post', 'article').exec(function (err, result) {
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

router.post('/is_fallowed', function (req, res, next) {
    try {
        let postData = req.body;
        let userID = postData.user_ID.toString();
        let writerID = postData.writer_ID.toString();
        User.findOne({$and: [{_id: writerID}, {"followedBy": userID}]}).limit(5).populate('post', 'article').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            if (result)
                res.json({is_fallowed: true});
            else
                res.json({is_fallowed: false});
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/increase_view_count', function (req, res, next) {
    try {
        let postID = req.body.post_ID.toString();
        Post.updateOne({_id: postID}, {$inc: {viewCount: 1}}).limit(5).populate('post', 'article').exec(function (err, result) {
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