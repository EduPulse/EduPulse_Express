const express = require('express');
const User = require('../models/user');
const Report = require('../models/report')

var router = express.Router();

router.post('/report_author', function (req, res, next) {
    try {
        console.log(req.body);
        //  let reportedUser = req.body.reported_author;
       
        // User.findByIdAndUpdate({_id: reportedUser}, 
        //     {
        //         reports:[{
        //             reportedBy: req.body.reported_by, 
        //             title: req.body.report_title, 
        //             message: req.body.report_reason
        //         } ]
        //     },
        //     function(err) {  
        //         if (err) {  
        //             res.send(err);  
        //             return;  
        //         }  
        //         res.send({data:"Report recorded in user model..!!"});  
        //     }
        // );

        Report.create({
            reportedBy: req.body.reported_by,
            type: req.body.report_type,
            title: req.body.report_title,
            message: req.body.report_reason,
            against: req.body.reported_author,
            against: [{user: [{_id: req.body.reported_author}]}]
            },
            function(err) {  
                if (err) {  
                    res.send(err);  
                    return;  
                }  
                res.send({data:"Report recorded in report model..!!"});  
            }
        )
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;