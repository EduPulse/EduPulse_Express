const express = require('express');
const Post = require('../../models/post');
const {convert} = require("html-to-text");
const readingTime = require("reading-time");
const filter = require("leo-profanity");
const User = require("../../models/user");

var router = express.Router();

// TODO [not sure] add other information of the author
router.post('/', function (req, res, next) {
    let authorID = req.body.author_ID;
    // get author university
    try {
        User.find({_id: authorID}).select("academicInstitute").exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            Post.create({
                type: "article",
                visibility: "Anyone",
                author: authorID,
                academicInstitute: result[0].academicInstitute,
                "article.status": "unpublished",
            }, (function (err, resultCreate) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(resultCreate);
            }));
        });

    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/real_time_content_save', function (req, res) {
    let postContent = req.body.post_content.toString();
    let postTitle = req.body.post_title.toString()
    let postID = req.body.post_ID;

    const contentPlainText = convert(postContent, {wordwrap: 130});

    // bad word detection
    if (!filter.check(postTitle + " " + contentPlainText)) {
        try {
            Post.updateOne({_id: postID}, {
                article: {
                    current: {
                        content: postContent,
                        title: postTitle
                    }
                }
            }).exec((function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }));
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.json({bad_word: true});
    }
});

// TODO publish post option
router.post('/publish_post', function (req, res) {

    let postID = req.body.post_ID;
    let licence = req.body.post_licence;
    let tagArray = req.body.related_tags;
    let visibilityValue = req.body.post_visibility;
    let content = req.body.post_content;
    let title = req.body.post_title;
    let coverImageLink = req.body.cover_image;
    let contributor = req.body.contributor;

    const contentPlainText = convert(content, {wordwrap: 130});

    // Read time prediction
    const readTime = readingTime(contentPlainText)["minutes"];

    // bad word detection
    if (!filter.check(title + " " + contentPlainText)) {
        try {
            let updateQueryPost = {
                version: 1,
                content: content,
                title: title,
                contributor: contributor,
                readTime: readTime,
                coverImage: coverImageLink,
                tags: tagArray
            };
            // save into article.current
            // save extra data
            let mainQuery;
            if (licence === "")
                mainQuery = {article: {current: updateQueryPost, status: "published"}, visibility: visibilityValue};
            else
                mainQuery = {
                    article: {
                        current: updateQueryPost,
                        status: "published",
                        license: licence,
                    },
                    visibility: visibilityValue,
                };

            Post.updateOne({_id: postID}, mainQuery).exec((function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }));

        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.json({bad_word: true});
    }
});

router.post('/publish_post_version', function (req, res) {
    let postID = req.body.post_ID;
    let tagArray = req.body.related_tags;
    let content = req.body.post_content;
    let title = req.body.post_title;
    let coverImageLink = req.body.cover_image;
    let contributor = req.body.contributor;

    const contentPlainText = convert(content, {wordwrap: 130});

    // Read time prediction
    const readTime = readingTime(contentPlainText)["minutes"];

    // bad word detection
    if (!filter.check(title + " " + contentPlainText)) {
        try {
            //push into article.versions
            let queryPush = {
                $push: {
                    "article.versions": {
                        version: Math.random() * 10,
                        content: content,
                        title: title,
                        contributor: contributor,
                        readTime: readTime,
                        coverImage: coverImageLink,
                        tags: tagArray
                    }
                }
            };
            Post.updateOne({_id: postID}, queryPush).exec((function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                console.log("done", queryPush)
                res.json(result);
            }));

        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.json({bad_word: true});
    }
});

router.post('/make_state_unpublished', function (req, res) {
    let postID = req.body.post_ID;
    try {
        Post.updateOne({_id: postID}, {"article.status": "unpublished"}).exec((function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        }));
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;