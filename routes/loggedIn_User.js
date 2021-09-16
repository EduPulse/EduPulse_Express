const express = require('express');
const User = require('../models/user');
const Post = require('../models/post');
const Tag = require('../models/tag');
const Institute = require('../models/institute');

var router = express.Router();

router.post('/', function (req, res, next) {
    try {
        let userData = req.body;
        let userID = userData._id.toString();

        console.log("Logged in user ");
        console.log(userID);

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

router.post('/get_all_publication', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user post: ");
        console.log(userID);

        Post.find({author: userID}).populate("pin.originalPost", "").exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_all_tags', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user tags: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.followingTags);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_allTags', function (req, res, next) {
    try {
        Tag.find({}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_followingUsers', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user following users: ");
        console.log(userID);

        User.find({"followedBy": userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
        // User.findOne({_id: userID}).exec(function (err, result) {
        //     if (err) {
        //         console.error(err);
        //         res.sendStatus(500);
        //     }
        //     res.json(result.following);
        // })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_followedBy', function (req, res, next) {
    try {
        let userID = req.body.user_id.toString();

        console.log("Logged in user followed by: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.followedBy);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_socialAccounts', function (req, res, next) {
    try {
        console.log("request body: ", req.body);
        let userID = req.body._id.toString();

        console.log("Logged in user social accounts: ");
        console.log(userID);

        User.findOne({_id: userID}).exec(function (err, result) {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result.socials);
        })
    } catch (error) {
        res.sendStatus(500)
    }
});

router.post('/get_followAuthor', function (req, res, next) {
    console.log(req.body);
    try {
        let userID = req.body.user_ID.toString();
        let writerID = req.body.writer_ID.toString();
        User.findOne({$and: [
                {_id: writerID}, 
                {"followedBy": userID}
            ]}).exec(function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                if (result)
                    res.json({is_followed: true});
                else
                    res.json({is_followed: false});
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/set_followAuthor', function (req, res, next) {
    console.log(req.body);
    try {
        let userID = req.body.user_ID.toString();
        let writerID = req.body.writer_ID.toString();
        User.updateOne({_id: writerID}, 
                {$addToSet: 
                    {followedBy: {_id: userID}}
                }
            ).exec(function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }
        )
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/set_unFollowAuthor', function (req, res, next) {
    console.log(req.body);
    try {
        let userID = req.body.user_ID.toString();
        let writerID = req.body.writer_ID.toString();
        User.updateOne({_id: writerID}, 
                {$pull:
                    {followedBy: userID}
                }
            ).exec(function (err, result) {
                if (err) {
                    console.error(err);
                    res.sendStatus(500);
                }
                res.json(result);
            }
        )
    } catch (error) {
        res.sendStatus(500)
    }
})

router.post('/get_university', function (req, res, next) {
    console.log(req.body);
    try {
        let uniID = req.body.university_id.toString();
        Institute.findOne({_id: uniID}).populate('').exec(function(err, result) {
            if(err) {
                console.error(err);
                res.sendStatus(500);
            }
            res.json(result);
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = router;