const express = require('express');
const User = require('../../models/user');
const institute = require('../../models/institute');
const auth = require('../../modules/auth');
const Institute = require('../../models/institute');

var router = express.Router();

// (req, res, next) => {auth.assertRole(['general', 'academic'], req, res, next)}
router.post('/role', auth.assertNone, function(req, res, next){
    const user_id = req.user._id;
    console.log(user_id);
    console.log(req.body);
    if(user_id){
        try{
            if(req.body.userType=='Yes'){
                User.findOneAndUpdate(
                    {_id: user_id},
                    {$set:{ "academicInstitute":req.body.uniName,
                    "role":"general",
                    "academicEmail":req.body.acaEmail,
                    "academic.state":"in review",
                    "academic.role":req.body.acaRole}}
                )
                .exec()
            }else{
                User.findOneAndUpdate(
                    {_id: user_id},
                    {$set:{ "role":"general" }}
                )
                .exec()
            }   
        }
        catch(err){
            res.sendStatus(500)
            console.log( err )
        }
        res.send('Updated successfully')
    }
})

router.get('/getInstitutes', auth.assertNone, function(req, res, next){
    try {
        const user_id = req.user._id;

        Institute.find({}).populate('').exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            console.log(result);
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/perDetails', auth.assertNone, function(req, res, next){
    const user_id = req.user._id;
    console.log(user_id);
    console.log(req.body);
    if(req.body.gender){
        try{
            User.findOneAndUpdate(
                {_id: user_id},
                {$set:{"gender":req.body.gender, "birthday":req.body.birthday}}
            )
            .exec()
            
        }
        catch(err){
            res.sendStatus(500)
            console.log( err )
        }
        res.send('Updated successfully')
    }
})

module.exports = router;