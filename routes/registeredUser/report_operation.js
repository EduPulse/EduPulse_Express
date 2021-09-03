const express = require('express');
const Post = require('../../models/post');
const User = require('../../models/user');
const Report = require('../../models/report');

var router = express.Router();

router.post('/check_already_reported', function (req, res, next) {
    try {
        let postData = req.body;
        let objectID = postData.object_ID;
        let userID = postData.user_ID;
        let checkType = postData.object_type.toString();

        let searchQuery;
        if (checkType === "post")
            searchQuery = {$and: [{reportedBy: userID}, {type: "post"}, {"against.post": objectID}]};
        else
            searchQuery = {$and: [{reportedBy: userID}, {type: "comment"}, {"against.comment": objectID}]};

        Report.findOne(searchQuery).populate('', '').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            if (result)
                res.json({"report_available": true});
            else
                res.json({"report_available": false});
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;