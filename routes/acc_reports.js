const express = require('express');
const feed = require('../modules/feed');
const Post = require('../models/post');

const report = require('../models/report');
const user = require('../models/user');
var router = express.Router();

router.get('/', async  function (req, resp, next) {
    /* report.find({type:"User"})
    .populate({path:'against.user',select:['name','role']})
    .populate({path:'reportedBy',select:'name'})
    .exec(function(err, reports) {
        if(err) {
            console.error(err);
            res.sendStatus(500);
        }
        res.json(reports);
    }) */
    const res =await report.aggregate([
        { $match: { type: {$eq: "User"}}},
        { $group: {
            _id: '$against.user',
            count:{
                $sum:1
            }}
        },
        { $match: { count: {$gte: 10}}}
        //{$lookup:{from:'users',localField: '_id', foreignField:'_id', as: 'against'}}
      ]).sort({ _id: 'asc' });

      await user.populate(res,{path:'_id',select:['name','role','university']});
      
    resp.send(res);
});

router.post('/get',   function (req, res) {
    console.log(req.body)
    user.findById(req.body.data)
    .populate({path:'reports',populate: {path: 'reportedBy',select:'name' }})
    .select('reports')
    .exec(function(err, reports) {
        if(err) {
            console.error(err);
            res.sendStatus(500);
        }
        res.json(reports);
    })
});

router.post('/manageReports',   function (req, res) {
    console.log(req.body)
    if(req.body.type==="reInstate"){
        user.findByIdAndUpdate(req.body.data,{accountStatus:'active'},function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.send('Account activated successfully');
        })
    }
    else if(req.body.type==="deactive"){
        user.findByIdAndUpdate(req.body.data,{accountStatus:'deactive'},function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.send('Account activated successfully');
        })
    }
    
});
/* router.post('/', function (req, res, next) {
    try {
        let newPost = req.body;
        // console.log(newPost.article.versions);
        // res.send(newPost);
        if(newPost.type === "article") {
            const article = new Post(newPost);
            article.save(function(err) {
                if(err) {
                    console.error(err);
                    res.status(500).send(err);
                } else {
                    res.send("saved");
                };
            });
        }
    } catch (error) {
        res.sendStatus(500)
    }
}); */


module.exports = router;