const dotenv = require('dotenv');
dotenv.config();

module.exports = Object.freeze({
    version: '0.8',
    environment: process.env.NODE_ENV,
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
    applicationRoot: process.env.APPLICATION_ROOT,
    webRoot: process.env.WEB_ROOT,
    sessionSecret: process.env.SESSION_SECRET,

    // **** Dummy user info for authentication bypass ****
    USE_DUMMY_PROFILE: (process.env.NODE_ENV === 'production') ? null : process.env.DUMMY_PROFILE, // In production this should be **NULL**
    DUMMY_PROFILE_MOD: {
        profilePicture: "https://www.discordavatars.com/wp-content/uploads/2020/05/454302316162580490.jpg",
        role: "moderator",
        _id: "60ecfe51395a1704a42d8cae",
        name: "Chalaka Kumarasinghe",
        personalEmail: "sachinthakac@gmail.com"
    },
    DUMMY_PROFILE_ACA: {
        "name": "Heshan jayasuriya",
        "personalEmail": "team.binary.bits@gmail.com",
        "role": "academic",
        "profilePicture": "http://waynehartzler.net/wp-content/uploads/2014/12/Graduation.jpg",
        "_id": "60ed8d6597a4670ca060ed6b"
    },
    DUMMY_PROFILE_ADMIN: {
        "name":"EduPulse Admin",
        "personalEmail":"edupulse27@gmail.com",
        "role":"admin",
        "profilePicture":"https://lh3.googleusercontent.com/a-/AOh14Gj-Pmjhaga31myDqS33zBZqUpo5Y3xPf5Tmzvc=s96-c",
        "_id":"60ed4643afb6661fb026db37"
    },
    DUMMY_PROFILE_GEN: {
        "name":"Devshan Fernando",
        "personalEmail":"devshan98@gmail.com",
        "role":"none",
        "profilePicture":null,
        "_id":"61480f22ea7908258095a1e0"
    },
});
