const express = require('express');
const feed = require('../modules/feed');
const Post = require('../models/post');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID=postData._id.toString();
        Post.find({_id:postID}).populate('author', 'name personalEmail role bio profilePicture status university').exec(function(err, posts) {
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