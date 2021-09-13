const dotenv = require('dotenv');
dotenv.config();

module.exports = Object.freeze ({
    version: '0.8',
    clients: {
        google: {
            id: process.env.GOOGLE_CLIENT_ID,
            secret: process.env.GOOGLE_CLIENT_SECRET,
        },
        azure: {
            id: process.env.AZURE_CLIENT_ID,
            secret: process.env.AZURE_CLIENT_SECRET,
            identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
            issuer: 'https://login.microsoftonline.com/9188040d-6c67-4c5b-b112-36a304b66dad/v2.0',
            tenent: '2bfb8311-4459-4279-b2d7-c46091750410'
        },
        mongo: {
            connection_string: process.env.CONNECTION_STRING
        },
        cloudinary: {
            cloud_name: 'edupulse',
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET,
            secure: true
        }
    },
    applicationRoot: 'http://localhost:9000',
    sessionSecret: process.env.SESSION_SECRET
});