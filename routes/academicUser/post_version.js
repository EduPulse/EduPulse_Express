const express = require('express');
const Post = require('../../models/post');
const User = require('../../models/user');
const {convert} = require("html-to-text");
const readingTime = require("reading-time");
const filter = require("leo-profanity");

var router = express.Router();


router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID;
        let newAuthorID = postData.new_author_ID;

        Post.updateOne({_id: postID}, {
            "article.current.contributor": newAuthorID,
            "article.status": "unpublished"
        }).exec(function (err, result) {
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

router.post('/save_version', function (req, res, next) {
    let postID = req.body.post_ID;
    let licence = req.body.post_licence;
    let tagArray = req.body.related_tags;
    let visibilityValue = req.body.post_visibility;
    let content = req.body.post_content;
    let title = req.body.post_title;
    let coverImageLink = req.body.cover_image;
    let contributor = req.body.contributor;
    let institute = req.body.institute;
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
            if (institute === "")
                mainQuery = {article: {current: updateQueryPost, status: "published"}, visibility: visibilityValue};
            else
                mainQuery = {
                    article: {
                        current: updateQueryPost,
                        status: "published",
                        license: licence,
                    },
                    visibility: visibilityValue,
                    academicInstitute: institute
                };

            // Post.findOneAndUpdate({_id: postID}, mainQuery).exec((function (err, result) {
            //     if (err) {
            //         console.error(err);
            //         res.sendStatus(500);
            //     }

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
            Post.findOneAndUpdate({_id: postID}, queryPush).exec((function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }));


            // }
            // ));
        } catch (error) {
            res.sendStatus(500)
        }
    } else {
        res.json({bad_word: true});
    }
});

module.exports = router;