const express = require('express');
const Report = require('../models/report')

var router = express.Router();

router.post('/report_author', async function (req, res, next) {
    try {
        console.log("Report req body: ", req.body);
        
        //report count == 10 -> disabled

        const instance = new Report ({
            reportedBy: req.body.reported_by,
            type: req.body.report_type,
            title: req.body.report_title,
            message: req.body.report_reason,
            against: {user: req.body.reported_author}
            },
        )

        await instance.save().then(res.send({data:"Report recorded in report model..!!"}));
    } catch (error) {
        res.sendStatus(500)
    }
});

module.exports = router;