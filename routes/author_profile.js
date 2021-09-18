const express = require('express');
const Report = require('../models/report');
const User = require('../models/user');

var router = express.Router();

router.post('/report_author', async function (req, res, next) {
    try {
        console.log("Report req body: ", req.body);
        
        const instance = new Report ({
            reportedBy: req.body.reported_by,
            type: req.body.report_type,
            title: req.body.report_title,
            message: req.body.report_reason,
            against: {user: req.body.reported_author}
        });

        await instance.save();

        await User.findOneAndUpdate(
            {_id: req.body.reported_author},
            {$push: {reports: [{
                    reportedBy: req.body.reported_by,
                    title: req.body.report_title,
                    message: req.body.report_reason,
                }]
            }},
        ).exec((function(err, result) {
                if (err) {  
                    res.send(err);  
                    return;  
                }
                let reportCount = 1;
                result.reports.map(report => {
                    reportCount = reportCount + 1
                })
                console.log("RESULT COUNT: ", reportCount)
                if (reportCount == 10) {
                    console.log("ACCOUNT ON HOLDDDDDDDD");
                    User.findOneAndUpdate(
                        {_id: req.body.reported_author},
                        {accountStatus: "onHold"}
                    ).exec((function(err, res){
                        if (err) {
                            console.error(err);
                            res.sendStatus(500);
                        }
                        console.log("ACCOUNT STATUS: ", result.accountStatus);
                    }))
                }
                res.json(result);
            }
        ))
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;