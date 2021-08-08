const express = require('express');
const Post = require('../models/post');

var router = express.Router();

// immediate level comment only handled
// nexted comments can not tackle
router.post('/', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let likeDislike = postedData.like_dislike.toString();
        let commentID=postedData.comment_ID;
        let postID=postedData.post_ID;
        let update;
        if (likeDislike === 'like') {
            update =   {$push: { 'comments.$.upvotes': {by: userID}} };

        } else {
            update =   {$push: { 'comments.$.downvotes': {by: userID}} };
        }
        Post.find({_id:postID,'comments._id':commentID}).update(update).exec(function (err, posts) {
            if (err) {
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