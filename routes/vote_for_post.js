const express = require('express');
const Post = require('../models/post');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID.toString();
        let likeDislike = postedData.like_dislike.toString();
        let postID = postedData.post_ID.toString();
        let update;
        let deleteOperation;

        if (likeDislike === 'like') {
            update = {$push: {'article.upvotes': {by: userID}}};
            deleteOperation={"article.downvotes.by":userID};
        } else {
            update = {$push: {'article.downvotes': {by: userID}}};
            deleteOperation={"article.upvotes.by":userID};
        }
        Post.findOne({_id: postID}).update(update).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        });
        Post.updateOne({$and:[{_id: postID},deleteOperation]}).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(posts);
        });

    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/is_reacted', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let postID = postedData.post_ID.toString();
        let likeDislike = postedData.like_dislike.toString();
        let query;
        if (likeDislike === 'like') {
            query = {$and: [{'article.upvotes.by': userID}, {_id: postID}]};
            Post.findOne(query).populate('post').exec(function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    if (result)
                        res.json({"is_upvoted": true})
                    else
                        res.json({"is_upvoted": false})
                }
            })
        } else {
            query = {$and: [{'article.downvotes.by': userID}, {_id: postID}]};
            Post.findOne(query).populate('post').exec(function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                } else {
                    if (result)
                        res.json({"is_downvoted": true})
                    else
                        res.json({"is_downvoted": false})
                }
            })
        }

    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;