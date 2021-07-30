const express = require('express');
const feed = require('../modules/feed');
const Post = require('../models/post');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID=postData._id;
        Post.find({_id:postID}).populate('comments','commenter content timestamp').exec(function(err, comments) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(comments);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/writeComment', function (req, res, next) {
    try {
        let postData = req.body;
        let postID=postData._id.toString();
        let commenter=postData.userID.toString();
        let comment=postData.comment.toString();
        const update ={ $push: { comments:{commenter: commenter,content:comment} }};
        Post.findOne({_id:postID}).update(update).exec(function(err, posts) {
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

//TODO sub comment writing is not completed
router.post('/writeCommentReply', function (req, res, next) {
    try {
        let postData = req.body;
        let parentComment=postData.parentCommentID.toString()
        let postID=postData._id.toString();
        let commenter=postData.userID.toString();
        let comment=postData.comment.toString();
        const update ={ $push: { comments:{contents:{commenter: commenter,content:comment} }}};
        Post.findOne({_id:postID,comments:[{_id:parentComment}]}).updateOne(update).exec(function(err, posts) {
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