const express = require('express');
const Report = require('../models/report');

var router = express.Router();

router.get('/', function (req, res, next) {
    
})

router.post('/', function (req, res, next) {
    try {
        let newReport = req.body;

        const report = new Report(newReport);
        report.save(function(err) {
            if(err) {
                console.error(err);
                res.status(500).send(err);
            } else {
                res.status(200);
            }
        })
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
})

module.exports = router;