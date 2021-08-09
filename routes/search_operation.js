const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Institute = require('../models/institute');
const Tag = require("../models/tag");

var router = express.Router();


router.post('/post', function (req, res, next) {
    let searchKey={$regex: req.body.search_key};
    try {
        Post.find({$or:[{"article.versions.title":searchKey},{"article.versions.content":searchKey}]}).populate('post author', '').exec(function (err, results) {
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
    let searchKey={$regex:  req.body.search_key};
    try {
        User.find({$or:[{name:searchKey},{bio:searchKey},{university:searchKey},{status:searchKey}]}).populate('user', '').exec(function (err, results) {
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
    let searchKey={$regex: req.body.search_key};
    try {
        Institute.find({$or:[{name:searchKey},{description:searchKey}]}).populate('institute', '').exec(function (err, results) {
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