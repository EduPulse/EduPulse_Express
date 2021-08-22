const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');
const Report=require('../models/report');

var router = express.Router();

router.post('/check_already_reported', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID.toString();
        let userID = postData.user_ID.toString();

        Post.findOne({$and:[{reportedBy:userID},{"against.post":postID}]}).populate('', '').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            // if(result)
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;