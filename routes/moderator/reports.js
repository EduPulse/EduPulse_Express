const express = require('express');
const mongoose = require('mongoose');
const Post = require('../../models/post');
const Report = require('../../models/report');
const User = require('../../models/user');
const { info, warn, sys } = require('../../modules/log');
const { APIError } = require('../../modules/error');

var router = express.Router();

router.get('/general', function (req, res, next) {

    async function getUserInstitute() {
        return new mongoose.Types.ObjectId("610f93e15196bb08091cab69");
    }

    (async () => {

        let reports = await Report.aggregate([
            {$match: {
                'against.userInstitute': await getUserInstitute(),
                status: { $in: ['open', 'in review']}
            }},
            {$group: {
                _id: {post: '$against.post', comment: '$against.comment'},
                type: { $first: '$type' },
                count: { $sum: 1 },
                reports: { $push: '$$ROOT' }
            }},
            {$sort: {
                count: -1
            }}
        ])
        .allowDiskUse(true)
        .exec();

        reports = await Post.populate(reports, [
            {path: '_id.post', select: ['author', 'article.status', 'article.license', 'article.current', 'pin', 'createdAt']}
        ]);

        reports = await User.populate(reports, [
            {path: '_id.post.author', select: ['name', 'personalEmail', 'academicEmail', 'profilePicture', 'role']},
            {path: 'reports.reportedBy', select: ['name', 'personalEmail', 'academicEmail', 'profilePicture', 'role']}
        ]);

        reports = reports.map(x => {
            x.counts = {
                total: x.count,
                open: 0,
                inReview: 0
            };
            delete x.count;
            x.categories = [];
            x.reports.forEach(y => {
                if(y.status === "open") 
                    x.counts.open += 1;
                else 
                    x.counts.inReview +=1;
                if(!x.categories.includes(y.category)) x.categories.push(y.category);
            });
            return x;
        });

        res.json(reports);

    })().catch (error => {
        console.error(error);
        res.sendStatus(500);
    });
});

router.post('/', function (req, res, next) {
    (async () => {
        // default status 500
        res.status(500);

        const session = await mongoose.startSession(); // transaction: session
        session.startTransaction();
        sys('Transaction started');

        try {

            // validate report
            let report = new Report(req.body);
            if(err = report.validateSync()) {
                res.status(406);
                throw err;
            }
            
            if(report.type === "post") {

                if(!(await Post.exists({_id: report.against.post}))) {
                    res.status(404);
                    throw APIError('Resource Not Found', `Post not found: Post ${report.against.post} not found`, null, null);
                }

                // get active reports for this post
                let reportCount = await Report.aggregate([
                    {$match: {
                        'against.post': report.against.post,
                        status: 'open'
                    }},
                    {$count: 'count'}
                ]);
                let currentReports = (reportCount.length === 0) ? 0 : reportCount[0].count;

                // try updating the post and get author info
                let post = await Post.findOneAndUpdate({ _id: report.against.post }, {
                    $push: { reports: report._id },
                    'article.status': ((currentReports >= 4) ? 'in review' : 'published')
                }, {
                    session: session,
                    new: true
                })
                .select('author visibility')
                .populate({
                    path: 'author',
                    select: '_id academicInstitute'
                })
                .exec();

                // add against fields, then save
                report.against.user = post.author._id;
                report.against.userInstitute = post.author.academicInstitute;
                report = await report.save({session});

                info(`Report, ${report._id} generated to ${report.type}: ${report.against.post}`);

                await session.commitTransaction();
                session.endSession();
                sys('Transaction ended')
                res.sendStatus(200);
                
            } else {
                throw APIError('Not Implemented', 'Only Post is implemented');
            }

        } catch (error) {
            await session.abortTransaction();
            sys('Transaction aborted');
            session.endSession();
            throw error;
        }
    })().catch(err => {
        if(typeof err === 'object' && err.name !== undefined) {
            res.json(err);
        } else {
            res.send(err);
        }
        console.error(err);
    });
});

router.put('/', (req, res, next) => {
    (async () => {
        // set default status
        res.status(500)

        const session = await mongoose.startSession(); // transaction: session
        session.startTransaction();
        sys('Transaction started');

        try {
            const json = req.body;
            
            if(!(json._ids !== undefined && json._ids.length !== 0 && (json.comment !== undefined || json.status !== undefined))) {
                res.status(406);
                throw APIError('Not accepable', 'JSON body is missing (a/some) key value pair(s)');
            }

            let update = {};
            if(json.comment !== undefined) update.comment = json.comment;
            if(json.status !== undefined) update.status = json.status;

            if(json.content && json.content.remove && json.content.type === "post") {
                let result = await Post.updateOne({ _id: json.content._id }, {'article.status': 'removed'}, { runValidators: true }).session(session);
                if(result.nModified > 0) {
                    info(`Post: ${json.content._id} removed`)
                } else {
                    res.status(404);
                    throw APIError('Post not found', null);
                }
            } else if(json.content && json.content.remove && json.content.type === "comment" && false) { // <----------- update comment
                let result = await Post.update({ _id: json.content._id }, {visibility: 'removed'}, { runValidators: true }).session(session);
                if(result.nModified > 0) {
                    info(`Comment: ${json.content._id} removed`)
                } else {
                    res.status(404);
                    throw APIError('Comment not found', null);
                }
            }

            const result = await Report.updateMany({ _id: { $in: json._ids } }, update, { runValidators: true }).session(session);

            if(result.nModified > 0) {
                info(
                    `Reports: ${json._ids.toString()} updated with`
                    + `${((json.status !== undefined) ? ' status: ' + json.status + ';': '')}`
                    + `${((json.comment !== undefined) ? ' comment: ' + json.comment + ';': '')}`
                );
                await session.commitTransaction();
                session.endSession();
                sys('Transaction ended')
                res.sendStatus(200);
            } else {
                res.status(404);
                throw APIError('Report(s) not found', null);
            }
        } catch (err) {
            await session.abortTransaction();
            sys('Transaction aborted');
            session.endSession();
            throw err;
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