const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    personalEmail: String,
    role: String
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;