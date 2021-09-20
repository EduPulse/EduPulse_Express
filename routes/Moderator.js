const express = require('express');
var router = express.Router();
const user = require('../models/user');
const institute = require('../models/institute');

router.get('/',function(req,res){
    try{
        user.find({role:"moderator"})
        .populate({path:'academicInstitute'})
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
    const uniFacName = req.body.univeristy+','+req.body.faculty
    //console.log(uniFacName)
    try{
        //If institue exist in db
        const findInstituteExist = () =>{
            return institute.findOne({name:uniFacName},).exec()
        }
        
        const institueID = await findInstituteExist()
        console.log(institueID._id)

        await user.findOneAndUpdate({personalEmail:req.body.email},{role:"moderator",academicInstitute:institueID})
        .exec(function(err, reports) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(reports);
        })
    }
    catch(err){
        //If institue not exist in db
        try{
            console.log('gya')
            const createNewInt = ()=>{
                let new_institute = new institute({name:uniFacName})
                return new_institute.save()
            }

            const institueID = await createNewInt()
            console.log(institueID._id)

            await user.findOneAndUpdate({personalEmail:req.body.email},{role:"moderator",academicInstitute:institueID})
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