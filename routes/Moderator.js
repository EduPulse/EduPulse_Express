const express = require('express');
var router = express.Router();
const user = require('../models/user');
const institute = require('../models/institute');

router.get('/',function(req,res){
    try{
        user.find({role:"moderator"})
        .populate({path:'academicInstitute',select:'name'})
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

router.post('/new',async(req,res)=>{
    try{
        await user.findOneAndUpdate({academicEmail:req.body.data.email},{role:"moderator"})
        .exec(function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(reports);
        })
    }
    catch(err){
        res.sendStatus(500)
    }
})

router.post('/delete',async(req,res)=>{
    try{
        await user.findByIdAndUpdate(req.body.data,{role:"general"})
        .exec(function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(reports);
        })
    }
    catch(err){
        res.sendStatus(500)
    }
})

module.exports = router;