const express = require('express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');

var router = express.Router();
let mongoose = require('mongoose');
const User = require("../../models/user");
const {sendNotification} = require("../../modules/notifications");


const makeNotificationComment = (postID,commentedUserID) => {
    User.findOne({_id: commentedUserID}).select(["name"]).exec(function (err, result) {
        if (err) {
            console.error(err);
        }

        Post.findOne({_id:postID}).select(["article.versions","article.current.title"]).exec(function (err, resultAuthors) {
            if (err) {
                console.error(err);
            }
            let contactList=[];
            resultAuthors.article.versions.map(data=>contactList.push(data.contributor))

            let descriptionObject={
                post_id:postID,
                user_or_author_id:commentedUserID,
                message:result.name+" commented on your(contributed) publication.",
                post_title:resultAuthors.article.current.title,
                timestamp:new Date().toString()
            }
            console.log(descriptionObject);
            sendNotification(contactList,"reaction",JSON.stringify(descriptionObject))
        })
    })
}

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

        Comment.create({commenter: commenter, content: comment}, (function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }

            let commentID = result._id;

            Post.findOne({_id: postID}).update({$push: {comments: commentID}}).exec(function (err, posts) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(posts);
                makeNotificationComment(postID,commenter)
            })
        }))


    } catch (error) {
        res.sendStatus(500)
    }
});

//TODO Next iteration of the dev
// router.post('/writeCommentReply', function (req, res, next) {
//     try {
//         let postData = req.body;
//         let parentComment = postData.parent_comment_ID.toString()
//         let postID = postData.post_ID.toString();
//         let commenter = postData.user_ID.toString();
//         let comment = postData.reply.toString();
//         let object_id = mongoose.Types.ObjectId();
//         const data = {$push: {'comments.$.comments': {_id: object_id, commenter: commenter, content: comment}}};
//         //{"_id":postID,comments: {$elemMatch:{"_id":parentComment}}}
//         Post.find({"comments._id": parentComment}).updateOne(data).exec(function (err, posts) {
//             if (err) {
//                 console.error(err);
//                 res.sendStatus(500);
//             }
//             res.json(posts);
//         })
//     } catch (error) {
//         res.sendStatus(500)
//     }
// });

module.exports = router;