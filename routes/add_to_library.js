const express = require('express');
const User = require('../models/user');

var router = express.Router();

router.post('/is_available_at_library', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let postID = postedData.post_ID;

        User.find({$and: [{_id: userID}, {'collections.savedPosts.postId': postID}]}).populate('users', 'collections').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            if (result.length > 0)
                res.json({"post_available": true});
            else
                res.json({"post_available": false});
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_collection_list', function (req, res, next) {
    try {
        let userID = req.body.user_ID;

        User.find({_id: userID}).populate('users', 'collections').exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(posts[0].collections);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/save_post', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let collectionName = postedData.collection_name;
        let postID = postedData.post_ID.toString();
        let update = {$addToSet: {'collections.$.savedPosts': [{postId: postID}]}};
        User.updateOne({_id: userID, 'collections.name': collectionName}, update).exec(function (err, posts) {
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


router.post('/create_collection', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let collectionName = postedData.collection_name;
        let update = {$push: {collections: {name: collectionName}}};
        User.findOne({_id: userID}).update(update).exec(function (err, posts) {
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

router.post('/create_collection_save_post', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData.user_ID;
        let postID = postedData.post_ID;
        let collectionName = postedData.collection_name;

        let update = {$push: {collections: {name: collectionName}}};
        User.findOne({_id: userID}).update(update).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        })

        update = {$addToSet: {'collections.$.savedPosts': [{postId: postID}]}};
        User.updateOne({_id: userID, 'collections.name': collectionName}, update).exec(function (err, posts) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
        })

        res.json({"is_success": true});

    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;