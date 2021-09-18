const express = require('express');
const Tag = require('../../models/tag');
const Post = require('../../models/post');
const User = require("../../models/user");
var router = express.Router();

router.get('/', function (req, res, next) {
    try {
        Tag.find({}).populate('tag', '').exec(function (err, results) {
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

router.post('/create_tag', function (req, res, next) {
    let tagVerbose = req.body.tag_verbose;
    try {
        Tag.create({verbose: tagVerbose}, function (err, results) {
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

// verbose to tagID
router.post('/verbose_id', function (req, res, next) {
    let tagVerbose = req.body.tag_verbose;
    try {
        Tag.findOne({verbose: tagVerbose}).populate('tag', '').exec(function (err, results) {
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

// tagID to verbose
router.post('/id_verbose', function (req, res, next) {
    let tagID = req.body.tag_id;
    try {
        Tag.findOne({_id: tagID}).populate('tag', '').exec(function (err, results) {
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

router.post('/get_home_page_tags', function (req, res, next) {
    let userID = req.body.user_id;
    try {
        // latest post tags
        Post.find({$and: [{"article.status": "published"}, {$or: [{type: "article"}, {type: "document"}]}]}).sort({createdAt: -1}).limit(100).select(['article.current.tags']).exec(function (err, resultPopularTags) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            // get tags for user
            User.findOne({_id: userID}).select(['followingTags.tagId']).exec(function (err, resultUserTags) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                // process combined array array
                let tagSet = [];
                let i = 0;
                resultPopularTags.map(data => {
                    data.article.current.tags.map(tagID => tagSet[i++] = tagID.toString())
                })

                if(resultUserTags)
                resultUserTags.followingTags.map(data => tagSet[i++] = data.tagId.toString())

                let uniqueTagSet = [];
                tagSet.map((e,i)=> !uniqueTagSet.includes(e) && uniqueTagSet.push(e) )

                res.json({tags: uniqueTagSet});
            })
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;