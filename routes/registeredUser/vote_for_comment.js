const express = require('express');
const Post = require('../../models/post');
const Comment = require('../../models/comment');
const User = require("../../models/user");
const {sendNotification} = require("../../modules/notifications");
var router = express.Router();

const makeNotificationVoteComment = (postID,commentID,reactedUserID) => {
    User.findOne({_id: reactedUserID}).select(["name"]).exec(function (err, result) {
        if (err) {
            console.error(err);
        }

        Comment.findOne({_id:commentID}).select(["commenter"]).exec(function (err, resultCommenter) {
            if (err) {
                console.error(err);
            }
            let commenter=resultCommenter.commenter;

            let descriptionObject={
                post_id:postID,
                user_or_author_id:reactedUserID,
                message:result.name+" reacted to your comment.",
            }

            sendNotification(commenter,"reaction",JSON.stringify(descriptionObject))
        })
    })
}

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
                // send notification
                makeNotificationVoteComment(postID,commentID,userID)
            });
        });
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;