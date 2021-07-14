const constants = require('../modules/constants');
const mongoose  = require('mongoose');

module.exports = mongoose.connect(constants.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});