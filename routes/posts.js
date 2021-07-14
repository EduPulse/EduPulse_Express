const express = require('express');
const feed = require('../modules/feed');
const Post = require('../models/post');

var router = express.Router();

router.get('/feed', function (req, res, next) {
    Post.find({}).populate('author', 'name personalEmail role profilePicture').exec(function(err, posts) {
        if(err) {
            console.error(err);
            res.sendStatus(500);
        }
        res.json(posts);
    })
});

router.post('/', function (req, res, next) {
    try {
        let newPost = req.body;
        // console.log(newPost.article.versions);
        // res.send(newPost);
        if(newPost.type === "article") {
            const article = new Post(newPost);
            article.save(function(err) {
                if(err) {
                    console.error(err);
                    res.status(500).send(err);
                } else {
                    res.send("saved");
                };
            });
        }
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;