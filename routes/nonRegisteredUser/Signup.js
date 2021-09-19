const express = require('express');
const User = require('../../models/user');

var router = express.Router();

router.post('/role', function(req, res, next){
    try {
        const user_id = req.body.userID;
        
        let dataList=[];
        req.body.followingTags.map(data => {
            dataList.push({tagId:data})
        })
        User.findOneAndUpdate({_id: user_id}, {
            followingTags:dataList
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
})

router.post('/perDetails', function(req, res, next){
    try {
        const user_id = req.body.userID;
        
        let dataList=[];
        req.body.followingTags.map(data => {
            dataList.push({tagId:data})
        })
        User.findOneAndUpdate({_id: user_id}, {
            followingTags:dataList
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
})

module.exports = router;