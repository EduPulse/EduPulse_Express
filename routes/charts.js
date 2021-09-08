const express = require('express');
var router = express.Router();
const user = require('../models/user');

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
       /*  const d = new Date();
        var x = d.getDay();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        
        for(var i=7;i>=1;i--){
            if(x-i>=0){
                daysArray.push(days[x-i])
            }
            else{
                daysArray.push(days[7+(x-i)])
            }
        }

        const daysArray=[0,0,0,0,0,0,0]; */
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
          
        console.log(res);
        resp.send(res);

        //new Date(createdAt).toLocaleString()
    }
    catch(err){
        resp.sendStatus(500)
    }
})

module.exports = router;