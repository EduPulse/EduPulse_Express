const express = require('express');
var router = express.Router();
const ad = require('../models/advertiser')
const upload = require('../modules/multer')
const cloudinary= require('../modules/cloudinary')

router.post('/',upload.single("media"),async function(req,res,next){
    try {
    console.log(req.body);

        const result = await cloudinary.uploader.upload(req.file.path);
        res.json(result);

        /* let ad_instance = new ad({
            publicName:req.body.clientName,
            contactDetails: {
                email:req.body.email,
                phoneNo:req.body.phone
            }
        });
        await ad_instance.save(function(err){
            if(err) return handleError(err)
            else{
                //res.status(201).json({message: 'New Ad Saved'});
                res.send("New Ad Saved")
            }
        }) */
    } catch (error) {
        res.sendStatus(500)
    }
}) 

module.exports = router;