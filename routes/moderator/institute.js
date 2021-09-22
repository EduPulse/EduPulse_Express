const express = require('express');
const mongoose = require('mongoose');
const Institute = require('../../models/institute');
const User = require('../../models/user');
const auth = require('../../modules/auth');

const upload = require('../../modules/multer');
const cloudinary = require('../../modules/cloudinary');

const instUserRouter = require('./users');

var router = express.Router();

router.use('/users', instUserRouter);

router.get('', auth.assertModerator, function (req, res) {

    async function getUserInstitute() {
        let user = await User.findOne({ _id: req.user._id }, 'academicInstitute');
        if(user && user.academicInstitute) {
            return user.academicInstitute;
        } else {
            return null;
        }
    }

    (async () => {
        res.status(500);

        let institute = await Institute.aggregate([
            { $match: { _id: await getUserInstitute() } },
            { $lookup: {
                from: "users",
                as: "_tempUsers",
                let: {instituteId: "$_id"},
                pipeline: [ 
                    { $match: {
                        $expr: { 
                            $eq: ['$$instituteId', '$academicInstitute']
                        },
                        'academic.state': 'academic',
                        role: {
                            $in: ['academic', 'moderator']
                        }
                    } },
                    { $project: { _id: 1 } } 
                ]
            } },
            { $lookup: {
                from: "posts",
                as: "_tempPosts",
                let: {instituteId: "$_id"},
                pipeline: [ 
                    { $match: {
                        $expr: { 
                            $and: [
                                { $eq: ["$$instituteId", "$academicInstitute"] },
                                { $not: { $eq: ["$visibility", "hidden"] } },
                                { $not: { $eq: ["$visibility", "removed"] } }
                            ]
                        }
                    } },
                    { $project: { _id: 1, viewCount: 1 } } 
                ]
            } },
            { $addFields: {
                "stats.noUsers": {$size: "$_tempUsers"},
                "stats.noPosts": {$size: "$_tempPosts"},
                "stats.noViews": {$sum: {
                    $map: { 
                        input: "$_tempPosts", 
                        as: "tp",
                        in: "$$tp.viewCount"
                    }
                }}
            } },
            { $unset: ["_tempUsers", "_tempPosts"] }
            // { $unset: ["_tempUsers", "_tempPosts"] }
        ]);

        res.status(200).json(institute[0]);
    })().catch(error => {
        console.error(error);
        res.sendStatus(500);
    })
});

router.put('', auth.assertModerator, function(req, res) {

    async function getUserInstitute() {
        let user = await User.findOne({ _id: req.user._id }, 'academicInstitute');
        if(user && user.academicInstitute) {
            return user.academicInstitute;
        } else {
            return null;
        }
    }

    (async () => {
        let data = req.body;

        res.status(500);

        let result = await Institute.updateOne({ _id: await getUserInstitute() }, {
                name: data.name,
                domain: data.domain,
                description: data.description,
                coverImage: data.coverImage,
                'contactDetails.email': data.contactDetails.email,
                'contactDetails.phoneNos': data.contactDetails.phoneNos,
                'contactDetails.address': data.contactDetails.address,
            }, {
                runValidators: true
            }
        );

        if(result.nModified > 0) {
            res.sendStatus(200);
        } else {
            res.status(404);
            throw new APIError('Resource not found', `Institute: ${data._id} not found`);
        }
    })().catch(error => {
        console.error(error);
        res.send(err);
    })
});

router.post('/cover', upload.single("cover"), auth.assertModerator, function(req, res) {

    async function getUserInstitute() {
        let user = await User.findOne({ _id: req.user._id }, 'academicInstitute');
        if(user && user.academicInstitute) {
            return user.academicInstitute;
        } else {
            return null;
        }
    }

    (async () => {

        res.status(500);
        result =  await cloudinary.uploader.upload(req.file.path, {folder: 'institutes/covers', unique_filename: true});

        res.status(200);
        res.send({coverUrl: result.secure_url});

    })().catch(error => {
        console.error(error);
        res.send(err);
    })
});


module.exports = router;
