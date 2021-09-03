var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'edupulse',
    api_key: 121222598611527,
    api_secret: '-sm7xW2-ZKUWv0L4zSH09NOOfTk',
    secure: true
})

module.exports = cloudinary;