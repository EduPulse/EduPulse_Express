var cloudinary = require('cloudinary').v2;
const config = require('../config/config')

cloudinary.config(config.clients.cloudinary)

module.exports = cloudinary;