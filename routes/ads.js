const express = require('express');
var router = express.Router();
const ad = require('../models/advertiser')
const upload = require('../modules/multer')
const cloudinary= require('../modules/cloudinary')
const auth = require('../modules/auth')

//get advertisments
router.get('/',auth.assertAdmin,function(req,res){
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

//post new advertisment
router.post('/new',auth.assertAdmin,upload.single("media"),async function(req,res){
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

//get advertisments for update
router.post('/getAD',auth.assertAdmin,function(req,res){
    try{
        console.log(req.body.data)
        ad.findOne({publicName:req.body.data.Client} , {advertisements:{$elemMatch:{_id:req.body.data.adID}}})
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

//update ad
router.put('/updateAD',auth.assertAdmin,upload.single("media"),async function(req,res){

            console.log(req.body);
            const adv = req.body;

            if(adv.startDate||adv.endDate||adv.adpackage||adv.type||adv.description||adv.redirectLink||req.file.path){
                if(adv.startDate){
                    try{
                        await ad.findOneAndUpdate(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {$set:{"advertisements.$.starting":adv.startDate}}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                if(adv.endDate){
                    try{
                        await ad.findOneAndUpdate(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {$set:{"advertisements.$.validTill":adv.endDate}}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                if(adv.adpackage){
                    try {
                        await ad.findOneAndUpdate(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {"advertisements.$.package":adv.adpackage}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                
                if(adv.advertType && req.file.path){
                    try{
                        var result=null;
                        if(adv.advertType=="Video"){
                            result =  await cloudinary.uploader.upload(req.file.path ,{resource_type: "video", eager_async: true,folder: 'Ads_Media/Videos',unique_filename: true});
                        }
                        else{
                            result =  await cloudinary.uploader.upload(req.file.path,{folder: 'Ads_Media/Images',unique_filename: true});
                        }
                        await ad.findOneAndUpdate(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {$set:{"advertisements.$.Media":result.secure_url,"advertisements.$.type":adv.advertType}}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                if(adv.description){
                    try{
                        await ad.updateOne(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {$set:{"advertisements.$.Description":adv.description}}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                if(adv.redirectLink){
                    try{
                        await ad.findOneAndUpdate(
                            {publicName:adv.client , advertisements:{$elemMatch:{_id:adv.id}}},
                            {$set:{"advertisements.$.redirectLink":adv.redirectLink}}
                        )
                        .exec()
                    }
                    catch(err){
                        res.sendStatus(500)
                    }
                }
                res.send('Updated successfully')
                
            }


})

//post new ad for a existing client
router.put('/same_client_new',auth.assertAdmin,upload.single("media"),async function(req,res){
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

router.delete('/delete',auth.assertAdmin,async function(req,res){
    try{
        console.log(req.body)
        //ad.findByIdAndDelete(req.body.answer)

        await ad.findOneAndUpdate(
            {publicName:req.body.Client},
            {$pull: {advertisements: {_id: req.body.adID} }},
            { new: true },
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
module.exports = router;