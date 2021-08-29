const express = require('express');
const User = require('../models/user');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let reportData = req.body;
        console.log(userData);
        let userID = reportData.authorID.toString();

        User.findByIdAndUpdate({_id: userID}, {
            reportedBy: req.body.userID,
            title: req.body.report_title,
            message: req.body.report_reason, 
        },
        function(err) {  
            if (err) {  
                res.send(err);  
                return;  
            }  
            res.send({data:"Report has been saved!!"});
        });
    } catch (error) {
        res.sendStatus(500)
    }
});