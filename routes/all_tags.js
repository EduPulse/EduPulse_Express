const express = require('express');
const Tag = require('../models/tag');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        Tag.find({}).populate('').exec(function(err, result) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});