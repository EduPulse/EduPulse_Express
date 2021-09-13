const config = require('../config/config');
const mongoose  = require('mongoose');

module.exports = mongoose.connect(config.clients.mongo.connection_string, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});