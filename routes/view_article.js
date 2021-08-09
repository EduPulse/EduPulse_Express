const express = require('express');
const Post = require('../models/post');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let postData = req.body;
        let postID=postData._id.toString();
        Post.findOne({_id:postID}).populate('author').exec(function(err, result) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;