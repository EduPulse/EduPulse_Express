const express = require('express');
const User = require('../models/user');

var router = express.Router();

router.post('/user', function (req, res, next) {
    try {
        let userData = req.body;
        let userID = userData._id.toString();
        User.findOne({_id: userID}).populate('').exec(function(err, result) {
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

router.post('/userProfileUpdate', function(req, res) {
    let userID = req.body.userID;

    try {
        console.log(req.body);
        
        // if (req.body.name)
        //     User.findByIdAndUpdate({_id: userID}, { name: req.body.name });
            
        // if (req.body.personalEmail)
        //     User.findByIdAndUpdate({_id: userID}, {  personalEmail: req.body.personalEmail });

        // if (req.body.bio)
        //     User.findByIdAndUpdate({_id: userID}, { bio: req.body.bio })

        // if (req.body.gender)
        //     User.findByIdAndUpdate({_id: userID}, { gender: req.body.gender })

        // if (req.body.bday) 
        //     User.findByIdAndUpdate({_id: userID}, { birthday: req.body.bday })

        User.findByIdAndUpdate({_id: userID}, 
            {
                name: req.body.name,
                personalEmail: req.body.personalEmail,
                //academicEmail: req.body.academicEmail,
                // profilePicture: req.body.profilePicture,
                bio: req.body.bio,
                gender: req.body.gender,
                birthday: req.body.bday,
                // univeristy: req.body.univeristy.toString(),
                // faculty: req.body.faculty.toString(),
            },
            function(err) {  
                if (err) {  
                    res.send(err);  
                    return;  
                }  
                res.send({data:"Profile has been Updated..!!"});  
            });
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post('/social', function (req, res, next) {
    try {
        let userData = req.body;
        let userID = userData._id.toString();
        User.findOne({_id:userID}).populate('').exec(function(err, result) {
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

router.post('/socialProfileUpdate', function(req, res) {
    let userID = req.body.userID;

    try {
        console.log(req.body);
        
        // if (req.body.name)
        //     User.findByIdAndUpdate({_id: userID}, { name: req.body.name });
            
        // if (req.body.personalEmail)
        //     User.findByIdAndUpdate({_id: userID}, {  personalEmail: req.body.personalEmail });

        // if (req.body.bio)
        //     User.findByIdAndUpdate({_id: userID}, { bio: req.body.bio })

        // if (req.body.gender)
        //     User.findByIdAndUpdate({_id: userID}, { gender: req.body.gender })

        // if (req.body.bday) 
        //     User.findByIdAndUpdate({_id: userID}, { birthday: req.body.bday })

        console.log(req.body.linkedin);
        console.log(req.body.facebook);
        console.log(req.body.twitter);
        console.log(req.body.github);
        console.log(req.body.personal);

        User.findByIdAndUpdate({_id: userID}, 
            {
                linkedin: req.body.linkedin,
                facebook: req.body.facebook,
                twitter: req.body.twitter,
                github: req.body.github,
                personal: req.body.personal,
            },
            function(err) {  
                if (err) {  
                    res.send(err);  
                    return;  
                }  
                res.send({data:"Social links have been Updated..!!"});  
            });
    } catch (error) {
        res.sendStatus(500);
    }
});

module.exports = router;