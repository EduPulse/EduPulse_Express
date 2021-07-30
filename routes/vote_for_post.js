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
        if (likeDislike === 'like') {
            update = {$push:{article: {upvotes: {by: userID}}}};
        } else {
            update = {$push: {article: {downvotes: {by: userID}}}};
        }
        Post.findOne({_id: postID}).updateOne(update).exec(function (err, posts) {
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