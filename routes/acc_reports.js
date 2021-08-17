const express = require('express');
const feed = require('../modules/feed');
const Post = require('../models/post');

const report = require('../models/report');
var router = express.Router();

router.get('/', function (req, res, next) {
    report.find({type:"account"})
    .populate({path:'against.user',select:['name','role']})
    .populate({path:'reportedBy',select:'name'})
    .exec(function(err, reports) {
        if(err) {
            console.error(err);
            res.sendStatus(500);
        }
        res.json(reports);
    })
});

/* router.post('/', function (req, res, next) {
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
}); */


module.exports = router;