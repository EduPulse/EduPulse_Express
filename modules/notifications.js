// uncomment below line after merge
// const config = require('../config/config');
const User = require('../models/user');
const { info } = require('../modules/log');

function sendNotification(userIDs, title, description, viewed) {
    return new Promise((resolve, reject) => {
        try {
            User.updateMany(
                { _id: { $in: userIDs } },
                { $push: {
                    notifications: {
                        title: title,
                        description: description,
                        viewed: (viewed !== null) ? viewed : false
                    }
                } },
                { 
                    runValidators: true 
                }, 
                (error, res) => {
                    if(error) {
                        throw error;
                    } else {
                        resolve(res.nModified)
                    }
                }
            );
        } catch (error) {
            reject(error)
        }
    });
};

function getNotifications(userID, type) {
    let condition = (type === 'push') 
        ? { $eq: ["$$notification.status", "generated"] } 
        : { $or: [
            { $eq: ["$$notification.status", "generated"] },
            { $eq: ["$$notification.status", "pushed"] } 
        ] };
    return new Promise((resolve, reject) => {
        try {
            User.aggregate(
                [
                    { $match: { _id: userID } },
                    { $project: {
                        notifications: {
                            $filter: {
                                input: "$notifications",
                                as: "notification",
                                cond: condition
                            }
                        }
                    } },
                    { $unwind: '$notifications'},
                    { $sort: { 'notifications._id': -1 } },
                    { $group: { 
                        _id: '$_id', 
                        'notifications': { $push: '$notifications' }
                    } }
                ],
                (error, notifis) => {
                    if(error) {
                        console.error(error);
                        reject(error);
                    } else {
                        notifis = notifis[0];
                        if(notifis) {
                            let notifiIds = notifis.notifications.map(x => x._id);
                            updateNotifications(userID, notifiIds, 'pushed');
                            resolve(notifis.notifications);
                        } else {
                            resolve([]);
                        }
                    }
                }
            );
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

function updateNotifications(userID, ids, status) {
    return new Promise((resolve, reject) => {
        try {
            User.updateMany(
                { 
                    _id: userID,
                },
                { $set: {
                    'notifications.$[notifi].status': status
                } },
                { 
                    arrayFilters: [  { "notifi._id": { $in: ids } } ], 
                    multi: true, 
                    runValidators: true 
                },
                (error, res) => {
                    if(error) {
                        throw error;
                    } else {
                        resolve(res.nModified)
                    }
                }
            );
        } catch (error) {
            reject(error)
        }
    });
};

module.exports = {
    sendNotification,
    getNotifications,
    updateNotifications
}