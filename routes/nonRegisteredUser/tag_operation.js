const express = require('express');
const Tag = require('../../models/tag');

var router = express.Router();

router.get('/', function (req, res, next) {
    try {
        Tag.find({}).populate('tag', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/create_tag', function (req, res, next) {
    let tagVerbose = req.body.tag_verbose;
    try {
        Tag.create({verbose: tagVerbose}, function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

// verbose to tagID
router.post('/verbose_id', function (req, res, next) {
    let tagVerbose = req.body.tag_verbose;
    try {
        Tag.findOne({verbose: tagVerbose}).populate('tag', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

// tagID to verbose
router.post('/id_verbose', function (req, res, next) {
    let tagID = req.body.tag_id;
    try {
        Tag.findOne({_id: tagID}).populate('tag', '').exec(function (err, results) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(results);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});


module.exports = router;