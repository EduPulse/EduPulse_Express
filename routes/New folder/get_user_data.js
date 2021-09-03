const express = require('express');
const User = require('../../models/user');

let router = express.Router();

// TODO restrict data population
router.post('/', function (req, res, next) {
    try {
        let postedData = req.body;
        let userID = postedData._id.toString();
        User.find({_id: userID}).populate('user', '').exec(function (err, results) {
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