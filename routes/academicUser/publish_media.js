const express = require('express');
const Post = require('../../models/post');
const {convert} = require("html-to-text");
const readingTime = require("reading-time");
const filter = require("leo-profanity");
const User = require("../../models/user");
const upload = require("../../modules/multer");
const cloudinary = require("../../modules/cloudinary");

var router = express.Router();

router.post('/initiate_publication', function (req, res, next) {
    let authorID = req.body.author_ID;
    let licence = req.body.post_licence;
    let tagArray = req.body.related_tags;
    let visibilityValue = req.body.post_visibility;
    let contentURL = req.body.content_url;
    let title = req.body.post_title;
    let coverImageLink = req.body.cover_image;
    let academicInstitute = req.body.academic_institute;

    let updateQueryPost = {
        version: 1,
        content: contentURL,
        title: title,
        contributor: authorID,
        coverImage: coverImageLink,
        tags: tagArray
    };

    // get author university
    try {
        Post.create({
            type: "document",
            author: authorID,
            academicInstitute: academicInstitute,
            visibility: visibilityValue,
            article: {
                status: "published",
                license: licence,
                current: updateQueryPost
            }
        }, (function (err, resultCreate) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(resultCreate);
        }));
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post('/publish_media_version', function (req, res) {
    let postID = req.body.post_ID;
    let authorID = req.body.author_ID;
    let tagArray = req.body.related_tags;
    let contentURL = req.body.content_url;
    let title = req.body.post_title;
    let coverImageLink = req.body.cover_image;

    try {
        //push into article.versions
        let queryPush = {
            $push: {
                "article.versions": {
                    version: Math.random() * 10,
                    content: contentURL,
                    title: title,
                    contributor: authorID,
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

    } catch (error) {
        res.sendStatus(500)
    }
});


// upload media for post
router.post('/upload_media_file', upload.single("media"), async function (req, res) {
    try {
        console.log(req.file);
        //res.json(result);
        let result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'Document_Post',
            unique_filename: true,
            resource_type: "auto",
            // format:req.file.type.split('/')[1]
        });
        res.json(result);
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router;