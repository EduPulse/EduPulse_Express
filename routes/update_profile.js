const express = require('express');
const User = require('../models/user');
const upload = require('../modules/multer')
const cloudinary= require('../modules/cloudinary')
var router = express.Router();

router.post('/userProfileUpdate', function (req, res, next) {
    try {
        console.log(req.body);
        let userID = req.body.userID;
       
        User.findByIdAndUpdate({_id: userID}, 
            {
                name: req.body.name,
                bio: req.body.bio,
                // univeristy: req.body.univeristy,
                // faculty: req.body.faculty,
                // academicEmail: req.body.academicEmail,
                personalEmail: req.body.personalEmail,
                gender: req.body.gender,
                birthday: req.body.bday,
            },
            function(err) {  
                if (err) {  
                    res.send(err);  
                    return;  
                }  
                res.send({data:"Profile has been Updated..!!"});  
            });
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/socialAccountsUpdate', function (req, res, next) {
    try {
        console.log("Social update request body: " ,req.body);
        let userID = req.body.userID;

        User.findByIdAndUpdate({_id: userID}, 
            {
                socials: {
                    linkedin: req.body.linkedin, 
                    facebook: req.body.facebook, 
                    twitter: req.body.twitter, 
                    github: req.body.github, 
                    personal: req.body.personal
                }
            },
            function(err) {  
                if (err) {  
                    res.send(err);  
                    return;  
                }  
                res.send({data:"Social accounts are Updated..!!"});
            });
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/updateFollowingTags', function(req, res, next){
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

router.put('/uploadProfPic',upload.single("media"),async function(req,res){
    console.log(req.file);
    const user_id = req.body.userID;
    if(req.file.path){
        try{
            
            var result=null;
            result =  await cloudinary.uploader.upload(req.file.path,{folder: 'Profile_Pictures',unique_filename: true, resource_type: "auto"});
            await User.findOneAndUpdate(
                {_id: user_id},
                {$set:{"profilePicture":result.secure_url}}
            )
            .exec()
            
        }
        catch(err){
            res.sendStatus(500)
            console.log( err )
            // console.trace(err)
        }
        res.send('Updated successfully')
    }
});

router.delete('/removeProfPic', function(req,res){
    const user_id = req.body.userID;
    if(user_id){
        try{
            User.findOneAndUpdate(
                {_id: user_id},
                {$set:{"profilePicture":""}}
            )
            .exec()   
        }
        catch(err){
            res.sendStatus(500)
            console.log( err )
            // console.trace(err)
        }
        res.send('Deleted successfully')
    }
});

module.exports = router;