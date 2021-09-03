const express = require('express');
const Post = require('../../models/post');
const User = require('../../models/user');

var router = express.Router();


router.post('/is_already_pin', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID.toString();
        let userID = postData.user_ID.toString();

        Post.find({$and: [{type: "pin"}, {"pin.originalPost": postID}, {author: userID}]}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            if (result.length > 0)
                res.json({post_already_pin: true});
            else
                res.json({post_already_pin: false});
        });

    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/make_post_pin', function (req, res, next) {
    try {
        let postData = req.body;
        let postID = postData.post_ID;
        let userID = postData.user_ID.toString();
        let pinMessage = postData.pin_message.toString();

        Post.findOneAndUpdate({_id: postID}, {$push: {"article.pinnedBy": {user: userID}}}).exec(function (err, resultPostMod) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            // add new post with type pin
            let dataInsert = {type: "pin", author: userID, "pin.originalPost": postID, "pin.pinComment": pinMessage}
            Post.create(dataInsert, (function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }));

        });

    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;