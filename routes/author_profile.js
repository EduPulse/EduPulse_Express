const express = require('express');
const Report = require('../models/report');
const User = require('../models/user');

var router = express.Router();

router.post('/report_author', async function (req, res, next) {
    try {
        console.log("Report req body: ", req.body);
        
        // const instance = new Report ({
        //     reportedBy: req.body.reported_by,
        //     type: req.body.report_type,
        //     title: req.body.report_title,
        //     message: req.body.report_reason,
        //     against: {user: req.body.reported_author}
        // });

        // await instance.save().then(res.send({data:"Report recorded in report model..!!"}));

        await User.findOneAndUpdate(
            {_id: req.body.reported_author},
            {$push: {reports: [{
                    reportedBy: req.body.reported_by,
                    title: req.body.report_title,
                    message: req.body.report_reason,
                }]
            }},
        ).exec((
            function(err, result) {
                if (err) {  
                    res.send(err);  
                    return;  
                }
                res.json(result);
                // const count = User.findById({_id: req.body.reported_author}).select('reports');
                // console.log("Count: ", count.body);
                // else {
                //     const reportCount = []; 
                //     reportCount = User.findById(req.body.reported_author).select('reports');
                //     console.log("num of reports: ", reportCount)
                //     if (reportCount == 10) {
                //         User.findOneAndUpdate({_id: req.body.reported_author}, {
                //             accountStatus: "onHold"
                //         },
                //         function(err) {
                //             if (err) {
                //                 res.send(err);  
                //                 return;  
                //             }
                //             res.json(result);
                //         }
                //         )
                //     }
                // }
            }
        ))
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;