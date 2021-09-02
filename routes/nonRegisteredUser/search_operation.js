const express = require('express');
const Post = require('../../models/post');
const User = require('../../models/user');
const Institute = require('../../models/institute');

var router = express.Router();


router.post('/post', function (req, res, next) {
    let searchKey = {$regex: new RegExp("" + req.body.search_key, "i")}
    try {
        // create query for filtering condition for search by tag id
        let filterQuery = {$and: [{$or: [{"article.current.title": searchKey}, {"article.current.content": searchKey}]}, {visibility: {$ne: "hidden"}}, {"article.status": "published"}, {$or: [{type: "article"}, {type: "document"}]}]}
        if (req.body.search_key.length === 24) {
            filterQuery = {$and: [{$or: [{"article.current.tags": {$in: req.body.search_key}}, {"article.current.title": searchKey}, {"article.current.content": searchKey}]}, {visibility: {$ne: "hidden"}}, {"article.status": "published"}, {$or: [{type: "article"}, {type: "document"}]}]}
        }
        Post.find(filterQuery).populate('post author', '').exec(function (err, results) {
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
        // create query for filtering condition for search by tag id
        let filterQuery = {$or: [{name: searchKey}, {bio: searchKey}, {university: searchKey}, {status: searchKey}]}
        if (req.body.search_key.length === 24) {
            filterQuery = {$or: [{_id: req.body.search_key}, {name: searchKey}, {bio: searchKey}, {university: searchKey}, {status: searchKey}]}
        }
        User.find(filterQuery).populate('user', '').exec(function (err, results) {
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
        // create query for filtering condition for search by tag id
        let filterQuery = {$or: [{name: searchKey}, {description: searchKey}]}
        if (req.body.search_key.length === 24) {
            filterQuery = {$or: [{_id: req.body.search_key}, {name: searchKey}, {description: searchKey}]}
        }
        Institute.find(filterQuery).populate('institute', '').exec(function (err, results) {
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