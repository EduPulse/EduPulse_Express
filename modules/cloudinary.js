const cloudinary = require('cloudinary')

cloudinary.config({
    cloud_name: 'edupulse',
    api_key: 121222598611527,
    api_secret: '-sm7xW2-ZKUWv0L4zSH09NOOfTk'
})

module.exports = cloudinary;