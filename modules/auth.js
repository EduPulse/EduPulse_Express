const config = require('../config/config');
const User = require('../models/user');

function authenticateUser(email) {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({
                $or: [
                    { personalEmail: email },
                    { academicEmail: email }
                ]
            }, [
                '_id',
                'name',
                'personalEmail',
                'role',
                'profilePicture'
            ], function(err, user) {
                if (err) {
                    console.error(err);
                    reject (err);
                };
                resolve(user);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        };
    });
};

function findAuthenticatedUser(id) {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({
                _id: id
            }, [
                '_id',
                'name',
                'personalEmail',
                'role',
                'profilePicture'
            ], function(err, user) {
                if (err) {
                    console.error(err);
                    reject (err);
                };
                resolve(user);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        };
    });
};

function createNewUser(email, name, profilePicture) {
    return new Promise((resolve, reject) => {
        try {
            User.create({
                personalEmail: email,
                name: name,
                profilePicture: profilePicture
            }, function(err, user) {
                if (err) {
                    console.error(err);
                    reject (err);
                };
                resolve({
                    _id: user._id,
                    personalEmail: user.personalEmail,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    role: user.role
                });
            });
        } catch (error) {
            console.error(error);
            reject(error);
        };
    });
};

function assertAuthenticated(req, res, next) {
	// USE DUMMY USER ????
	if(config.USE_DUMMY_PROFILE) {
		console.log('\x1b[31m', `USING DUMMY PROFILE ${config.USE_DUMMY_PROFILE} FOR AUTHENTICATON --- IN PRODUCTION THIS SHOULD BE REMOVED`, '\x1b[0m');
        req.user = config[config.USE_DUMMY_PROFILE];
		next();
	} else {
        if(req && req.isAuthenticated()) {
            next();
        } else {
            res.sendStatus(403);
        }
    }
  
};

function assertRole(roles, req, res, next) {

    // USE DUMMY USER ????
	if(config.USE_DUMMY_PROFILE) {
		console.log('\x1b[31m', `USING DUMMY PROFILE ${config.USE_DUMMY_PROFILE} FOR AUTHENTICATON --- IN PRODUCTION THIS SHOULD BE REMOVED`, '\x1b[0m');
        req.user = config[config.USE_DUMMY_PROFILE];
	}

    if(req && (config.USE_DUMMY_PROFILE || req.isAuthenticated()) && req.user && (roles.indexOf(req.user.role) > -1)) {
        next();
    } else {
        res.sendStatus(403);
    }
};

const assertNone = (req, res, next) => assertRole('none', req, res, next);
const assertGeneral = (req, res, next) => assertRole('general', req, res, next);
const assertAcademic = (req, res, next) => assertRole('acadedmic', req, res, next);
const assertModerator = (req, res, next) => assertRole('moderator', req, res, next);
const assertAdmin = (req, res, next) => assertRole('admin', req, res, next);

module.exports = {
    authenticateUser,
    findAuthenticatedUser,
    createNewUser,
    assertAuthenticated,
    assertRole,
    assertNone,
    assertGeneral,
    assertAcademic,
    assertModerator,
    assertAdmin,
}