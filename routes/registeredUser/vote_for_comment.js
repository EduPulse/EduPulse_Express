const express = require('express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
var router = express.Router();


router.post('/', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let likeDislike = postedData.like_dislike.toString();
        let commentID = postedData.comment_ID;
        let postID = postedData.post_ID;

        let update;
        let deleteOperation;
        let deleteSearch;

        if (likeDislike === 'like') {
            update = {$push: {upvotes: {by: userID}}};
            deleteOperation = {downvotes: {$pull: {$elemMatch: {by: userID}}}};
            deleteSearch = {"downvotes.by": [userID]}

        } else {
            update = {$push: {downvotes: {by: userID}}};
            deleteOperation = {upvotes: {$pull: {$elemMatch: {by: userID}}}};
            deleteSearch = {"upvotes.by": [userID]}
        }
        Comment.updateOne({_id: commentID}, update).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            Comment.updateOne({$and: [{_id: commentID}, deleteSearch]}, deleteOperation).exec(function (err, posts) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(posts);
            });
        });
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;