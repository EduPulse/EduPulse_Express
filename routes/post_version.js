const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

var router = express.Router();


router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID.toString();
        let userAuthorID = postData.new_author_ID.toString();

        Post.updateOne({_id: postID}, {$push: {"article.versions[$].title": "$article.current.title"}}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        });

    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;