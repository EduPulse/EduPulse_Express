const express = require('express');
var router = express.Router();
const { userLogin } = require('../modules/log');

router.post('/',(req,res)=>{
    try{
        console.log(req.body);
        userLogin(`${req.body.role} ${req.body.id}`);
    }
    catch(error){
        res.sendStatus(500);
    }
})

module.exports = router;