const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Advertiser = require('../models/advertiser');
const {now} = require("mongoose");

var router = express.Router();

// TODO check UpdateAt need to replace with CreateAt

router.post('/get_post_form_followers', function (req, res, next) {
    try {
        let userID = req.body.user_ID.toString();

        User.find({followedBy: userID}).populate('', '').select(['-collections', '-searchHistory', '-reports', '-subscribedNotifications']).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            let query = []
            result.map(data => query.push({author: data._id}))

            let visibilityOption = {visibility: "Academics Only"}
            if (result.role !== "academic")
                visibilityOption = {visibility: "Anyone"}

            // take data from post
            Post.find({$and: [visibilityOption, {$or: [{"article.status": "published"}, {type: "pin"}]}, {$or: query}]}).populate('author pin.originalPost', '').select(['-comments', '-article.current.content']).sort({"updatedAt": -1}).limit(50).exec(function (err, resultList) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(resultList);
            })
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_post_form_following_tags', function (req, res, next) {
    try {
        let userID = req.body.user_ID.toString();

        User.findOne({_id: userID}).populate('', '').select(['-collections', '-searchHistory', '-reports', '-subscribedNotifications']).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            let query = []
            result.followingTags.map(data => query.push({"article.current.tags": data.tagId}))

            let visibilityOption = {visibility: "Academics Only"}
            if (result.role !== "academic")
                visibilityOption = {visibility: "Anyone"}

            Post.find({$and: [visibilityOption, {"article.status": "published"}, {$or: query}]}).populate('author', '').select(['-comments', '-article.current.content']).sort({"updatedAt": -1}).limit(50).exec(function (err, resultList) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(resultList);
            })
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


router.get('/non_login_content', function (req, res, next) {
    try {
        Post.find({$and: [{visibility: "Anyone"}, {"article.status": "published"}]}).populate('author', '').select(['-comments', '-article.current.content']).limit(50).sort({"updatedAt": -1}).exec(function (err, result) {
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

router.get('/academic_content', function (req, res, next) {
    try {
        Post.find({$and: [{visibility: "Academics Only"}, {"article.status": "published"}]}).populate('author', '').select(['-comments', '-article.current.content']).limit(50).sort({"updatedAt": -1}).exec(function (err, result) {
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

router.get('/get_adds', function (req, res, next) {
    try {
        Advertiser.find({$and: [{"advertisements.validTill": {$gt: now()}}]}).populate('', '').select(['']).limit(50).sort({"updatedAt": -1}).exec(function (err, result) {
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

// load tag based value
router.post('/search_by_tag', function (req, res, next) {
    try {
        let tagID = req.body.tag_ID.toString();
        Post.find({$and: [{"article.current.tags": {$in: tagID}}]}).populate('author', '').select(['-comments', '-reports']).limit(50).sort({"updatedAt": -1}).exec(function (err, result) {
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