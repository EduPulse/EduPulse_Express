const express = require('express');
const Post = require('../models/post');
const User = require('../models/user');

var router = express.Router();


router.post('/is_already_pin', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID.toString();
        let userID = postData.user_ID.toString();

        Post.find({$and:[{_id:postID},{"article.pinnedBy[0]":{$in:userID}}]}).exec(function (err, result) {
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


module.exports = router;