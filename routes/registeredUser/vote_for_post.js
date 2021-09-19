const express = require('express');
const Post = require('../../models/post');
const User = require("../../models/user");
const {sendNotification} = require("../../modules/notifications");

var router = express.Router();

const makeNotificationVote = (postID,reactedUserID) => {
    User.findOne({_id: reactedUserID}).select(["name"]).exec(function (err, result) {
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
                user_or_author_id:reactedUserID,
                message:result.name+" reacted to your(contributed) publication.",
                post_title:resultAuthors.article.current.title,
                timestamp:new Date().toString()
            }

            sendNotification(contactList,"reaction",JSON.stringify(descriptionObject))
        })
    })
}

router.post('/', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID.toString();
        let likeDislike = postedData.like_dislike.toString();
        let postID = postedData.post_ID.toString();
        let update;
        let deleteOperation;
        let deleteSearch;
        if (likeDislike === 'like') {
            update = {$push: {'article.upvotes': {by: userID}}};
            deleteOperation = {"article.downvotes": {$pull: {$elemMatch: {by: userID}}}};
            deleteSearch = {"article.downvotes.by": [userID]}
        } else {
            update = {$push: {'article.downvotes': {by: userID}}};
            deleteOperation = {"article.upvotes": {$pull: {$elemMatch: {by: userID}}}};
            deleteSearch = {"article.upvotes.by": [userID]}
        }
        Post.findOne({_id: postID}).update(update).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            Post.updateOne({$and: [{_id: postID}, deleteSearch]}, deleteOperation).exec(function (err, posts) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                // send notification
                makeNotificationVote(postID,userID)
                res.json(posts);
            });
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