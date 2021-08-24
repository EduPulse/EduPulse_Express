const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Institute = require('../models/institute');

var router = express.Router();


router.post('/post', function (req, res, next) {
    let searchKey = {$regex: new RegExp("" + req.body.search_key, "i")}
    try {
        Post.find({$and: [{$or: [{"article.current.title": searchKey}, {"article.current.content": searchKey}]}, {visibility: {$ne: "hidden"}}, {"article.status": "published"}, {$or: [{type: "article"}, {type: "document"}]}]}).populate('post author', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        });
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/people', function (req, res, next) {
    let searchKey = {$regex: new RegExp("^" + req.body.search_key, "i")}
    try {
        User.find({$or: [{name: searchKey}, {bio: searchKey}, {university: searchKey}, {status: searchKey}]}).populate('user', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/institute', function (req, res, next) {
    let searchKey = {$regex: new RegExp("" + req.body.search_key, "i")}
    try {
        Institute.find({$or: [{name: searchKey}, {description: searchKey}]}).populate('institute', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;