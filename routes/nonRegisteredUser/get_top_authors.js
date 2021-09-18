const express = require('express');
const User = require('../../models/user');
const Post = require("../../models/post");

let router = express.Router();

router.get('/', function (req, res, next) {
    try {
        Post.find({$or:[{type:"article"},{type:"document"}]}).select('author').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            let countData={}
            console.log(results)
            results.map(postEntry=>{
                let reading =postEntry.author.toString();
                if(countData[reading]){
                    countData[reading]=countData[reading]+1;
                }else{
                    countData[reading]=1;
                }
            });
            // Create items array
            let items = Object.keys(countData).map(function(key) {
                return [key, countData[key]];
            });

            items.sort(function(first, second) {
                return second[1] - first[1];
            });

            let returnData=[];
            let i=1;
            items.slice(0, 3).map(item=>{
                User.findOne({_id:item[0]}).select(['name','profilePicture']).exec(function (err,result) {
                    if (err) {
                        console.error(err);
                        res.sendStatus(500);
                    }

                    returnData.push({place:i++,number_of_posts:item[1],profile_picture:result.profilePicture,author_name:result.name,author_id:item[0]})
                    if(i===4)
                        res.json(returnData);
                })
            });
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;