const express = require('express');
const mongoose = require('mongoose');
const Post = require('../../models/post');
const Report = require('../../models/report');
const User = require('../../models/user');
const { info, warn, sys } = require('../../modules/log');
const { APIError } = require('../../modules/error');
const auth = require('../../modules/auth');

var router = express.Router();

router.get('', auth.assertModerator, function (req, res, next) {

    async function getUserInstitute() {
        let user = await User.findOne({ _id: req.user._id }, 'academicInstitute');
        if(user && user.academicInstitute) {
            return user.academicInstitute;
        } else {
            return null;
        }
    }

    (async () => {

        let users = await User.find({
            academicInstitute: await getUserInstitute(),
            'academic.state': 'academic',
            role: {
                $in: ['academic', 'moderator']
            }
        }, [
            'name', 
            'personalEmail', 
            'academicEmail',
            'role',
            'profilePicture',
            'academic',
            'createdAt'
        ]);

        res.json(users);

    })().catch (error => {
        console.error(error);
        res.sendStatus(500);
    });
});

router.put('/', auth.assertModerator, (req, res, next) => {
    (async () => {
        // default status 500
        res.status(500);

        let json = req.body;

        if(!(json._id && json.academic && json.academic.role && json.role)) {
            res.status(406);
            throw new APIError('Not accepable', 'JSON body is missing (a/some) key value pair(s)')
        }

        let update = {
            role: json.role,
            academic: {
                state: (json.role === 'academic') ? 'academic' : 'none',
                role: json.academic.role,
            }
        }

        let result = await User.updateOne({_id: json._id}, update, {runValidators: true});

        if(result.nModified > 0) {
            info(`User ${json._id} is given academic role: ${json.academic.role};` + (json.role ? ` role: ${json.role}` : ''));
            res.sendStatus(200);
        } else {
            res.status(404);
            throw new APIError('User not found', `User: ${json._id} not found`);
        }
    })().catch(err => {
        if(typeof err === 'object' && err.name !== undefined) {
            res.json(err);
        } else {
            res.send(err);
        }
        console.error(err);
    });
})


module.exports = router;
