const express = require('express');
var router = express.Router();
const ad = require('../models/advertiser')
const upload = require('../modules/multer')
const cloudinary= require('../modules/cloudinary')

router.post('/new',upload.single("media"),async function(req,res){
    try {
            console.log(req.body);
            //res.json(result);
            var result=null;
            if(req.body.advertType=="Video"){
                result =  await cloudinary.uploader.upload(req.file.path ,{resource_type: "video", eager_async: true,folder: 'Ads_Media/Videos',unique_filename: true});
            }
            else{
                result =  await cloudinary.uploader.upload(req.file.path,{folder: 'Ads_Media/Images',unique_filename: true});
            }

            let ad_instance = new ad({
                publicName:req.body.clientName,
                contactDetails: {
                    email:req.body.email,
                    phoneNo:req.body.phone
                },
                advertisements: [{
                    starting: req.body.startDate,
                    validTill: req.body.endDate,
                    type:  req.body.advertType,
                    package: req.body.adpackage,
                    Description : req.body.description,
                    Media : result.secure_url,
                    redirectLink : req.body.redirectLink
                }]      
            });

            await ad_instance.save()
            .then(res.send("New Ad Saved"))

    } catch (error) {
        res.sendStatus(500)
    }
})

router.get('/',function(req,res){
    try{
        ad.find()
        .exec(function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(reports);
        })
    }
    catch(error){
        res.sendStatus(500)
    }
})

router.post('/getAD',function(req,res){
    try{
        console.log(req.body.data)
        ad.findOne({publicName:req.body.data.Client},{advertisements:{$elemMatch:{_id:req.body.data.adID}}})
        .exec(function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(reports);
            //console.log(reports)
        })
    }
    catch(error){
        res.sendStatus(500)
    }
})

router.put('/same_client_new',upload.single("media"),async function(req,res){
    try{
            console.log(req.body);
            var result=null;
            if(req.body.advertType=="Video"){
                result =  await cloudinary.uploader.upload(req.file.path ,{resource_type: "video", eager_async: true,folder: 'Ads_Media/Videos',unique_filename: true});
            }
            else{
                result =  await cloudinary.uploader.upload(req.file.path,{folder: 'Ads_Media/Images',unique_filename: true});
            }

            ad.updateOne(
                {publicName:req.body.client},
                {$push: {advertisements:[{
                    starting: req.body.startDate,
                    validTill: req.body.endDate,
                    type:  req.body.advertType,
                    package: req.body.adpackage,
                    Description : req.body.description,
                    Media : result.secure_url,
                    redirectLink : req.body.redirectLink
                }]
            }},
            function(err,result){
                if(err){
                    res.send(err);
                }
                else{
                    res.send(result);
                }
            }
            )
    }
    catch(err){
        res.sendStatus(500)
    }
})

/* router.delete('/delete',function(req,res){
    try{
        console.log(req.body)
        //ad.findByIdAndDelete(req.body.answer)

        ad.updateOne(
            {publicName:req.body.Client},
            {$pullAll: {advertisements:[
                req.body.adID
            ]
        }},
        function(err,result){
            if(err){
                res.send(err);
            }
            else{
                res.send(result);
            }
        }
        )
    }
    catch(err){
        res.sendStatus(500)
    }
}) */
module.exports = router;