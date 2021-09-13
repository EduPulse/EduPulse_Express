const express = require('express');
const mongoose = require('mongoose');
const Institute = require('../../models/institute')

var router = express.Router();

router.get('', function (req, res) {

    async function getUserInstitute() {
        return new mongoose.Types.ObjectId("610f93e15196bb08091cab69");
    }

    (async () => {
        res.status(500);

        // let institute = await Institute.findOne({_id: await getUserInstitute()});

        let institute = await Institute.aggregate([
            { $match: { _id: await getUserInstitute() } },
            { $lookup: {
                from: "users",
                as: "_tempUsers",
                let: {instituteId: "$_id"},
                pipeline: [ 
                    { $match: {
                        $expr: { $eq: ["$$instituteId", "$academicInstitute"] }
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

router.put('', function(req, res) {

    async function getUserInstitute() {
        return new mongoose.Types.ObjectId("610f93e15196bb08091cab69");
    }

    (async () => {
        let data = req.body;

        res.status(500);

        // let institute = await Institute.findOne({_id: await getUserInstitute()});

        let result = await Institute.updateOne({ _id: data._id }, {
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

module.exports = router;