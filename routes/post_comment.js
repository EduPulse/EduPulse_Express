const express = require('express');
const Post = require('../models/post');

var router = express.Router();
let mongoose = require('mongoose');

router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData._id;
        Post.findOne({_id: postID}).populate('comments').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            if (result)
                res.json(result.comments);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/writeComment', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID.toString();
        let commenter = postData.user_ID.toString();
        let comment = postData.comment_content.toString();
        const update = {$push: {comments: {commenter: commenter, content: comment}}};
        Post.findOne({_id: postID}).update(update).exec(function (err, posts) {
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

//TODO Nexted commented are not entertained, timestamps not there
router.post('/writeCommentReply', function (req, res, next) {
    try {
        let postData = req.body;
        let parentComment = postData.parent_comment_ID.toString()
        let postID = postData.post_ID.toString();
        let commenter = postData.user_ID.toString();
        let comment = postData.reply.toString();
        let object_id = mongoose.Types.ObjectId();
        const data = {$push: {'comments.$.comments': {_id: object_id, commenter: commenter, content: comment}}};
        //{"_id":postID,comments: {$elemMatch:{"_id":parentComment}}}
        Post.find({"comments._id": parentComment}).updateOne(data).exec(function (err, posts) {
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