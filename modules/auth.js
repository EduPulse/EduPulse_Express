const User = require('../models/user');

function authenticateUser(email) {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({personalEmail: email}, function(err, user) {
                if (err) {
                    console.error(err);
                    reject (err);
                };
                if(user !== null)
                    resolve(user);
                else
                    reject(null);
            });
        } catch (error) {
            console.error(error);
            reject(error);
        };
    });
};

// function authenticateUser(identifier, profile, done) {
//     console.log(identifier);
//     console.log("\n");
//     console.log(profile);
//     done(null, {user: 'user'});
// }

module.exports = {
    authenticateUser
}