const express = require('express');
var router = express.Router();
const user = require('../models/user');
const log = require('../models/log');

router.get('/totalusers',async function(req,res){
    try{
        var userCount = {academic:0,general:0};
        await user.countDocuments({role:"academic"},
            function (err, count) {
                if (err) console.log(err)
                else userCount.academic=count
            }
        );
        await user.countDocuments({role:"general"},
            function (err, count) {
                if (err) console.log(err)
                else userCount.general=count
                res.send(userCount);
            }
            
        );
        
    }
    
    catch(error){
        res.sendStatus(500)
    }
    
})

router.get('/userRegistrations',async (req,resp)=>{
    try{
        var dt = new Date();
        dt.setDate(dt.getDate()-8);

        const res = await user.aggregate([
            { $match: { createdAt: {$gte: dt}}},
            { $group: {
                _id: {$dateToString :{format: "%Y-%m-%d", date: "$createdAt"}},
                count:{
                    $sum:1
                }}
            }
          ]).sort({ _id: 'asc' });
          
        resp.send(res);

        //new Date(createdAt).toLocaleString()
    }
    catch(err){
        resp.sendStatus(500)
    }
})

router.get('/userLogins',async (req,resp)=>{
    try{
        var dt = new Date();
        dt.setDate(dt.getDate()-8);
        var data ={academic:null,general:null};
        
        //general user logins
        const res1 = await log.aggregate([
            { $match: 
                    { "v":{"$regex" :"general","$options": "i" }}
            },
            { $group: {
                _id: {$dateToString :{format: "%Y-%m-%d", date: { $toDate: "$_id" }}} ,
                count:{
                    $sum:1
                }}
            }
          ]).sort({ _id: 'desc' }).limit(7);
        
        //academic user logins
        const res2 = await log.aggregate([
            { $match: 
                    { "v":{"$regex" :"academic","$options": "i" }}
            },
            { $group: {
                _id: {$dateToString :{format: "%Y-%m-%d", date: { $toDate: "$_id" }}} ,
                count:{
                    $sum:1
                }}
            }
          ]).sort({ _id: 'desc' }).limit(7);
        
        
            data.general=res1;
            data.academic=res2;
            resp.send(data);
    }
    catch(err){
        resp.sendStatus(500)
    }
})

router.get('/liveUsers',async (req,resp)=>{
    try{
        var dt = new Date();
        dt.setDate(dt.getDate()-8);

        var data ={academic:null,general:null};

        const res1 = await log.aggregate([
            { $match: 
                    { "v":{"$regex" :"general","$options": "i" }}
            },
            { $group: {
                _id: {$dateToString :{format: "%Y-%m-%dT%H:%M", date: { $toDate: "$_id" }}} ,
                count:{
                    $sum:1
                }}
            }
          ]).sort({ _id: 'desc' }).limit(7);
        

        const res2 = await log.aggregate([
            { $match: 
                    { "v":{"$regex" :"academic","$options": "i" }}
            },
            { $group: {
                _id: {$dateToString :{format: "%Y-%m-%dT%H:%M", date: { $toDate: "$_id" }}} ,
                count:{
                    $sum:1
                }}
            }
          ]).sort({ _id: 'desc' }).limit(7);
        
        
            data.general=res1;
            data.academic=res2;
            resp.send(data);
    }
    catch(err){
        resp.sendStatus(500)
    }
})

module.exports = router;