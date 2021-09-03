const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    personalEmail: {
        type: String,
        required: true
    },
    academicEmail: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    birthday: {
        type: Date,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    academicState: new Schema ({
        state: {
            type: Boolean,
            required: true,
            default: false
        }
    }, {timestamps: true}),
    academicInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        required: false
    },
    socials: new Schema ({
        linkedin: {
            type: String,
            required: false
        },
        facebook: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        },
        github: {
            type: String,
            required: false
        },
        personal: {
            type: String,
            required: false
        },
    }, {timestamps: false}),
    followedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    notifications: [new Schema ({
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        status: {
            type: Boolean,
            required: false,
            default: false
        },
    }, {timestamps: true})],
    followingTags: [new Schema ({
        tagId: {
            type: Schema.Types.ObjectId,
            required: true,
            // ref: 'Tag'
        },
        type: {
            type: String,
            required: false
        }
    }, {timestamps: true})],
    subscribedNotifications: [new Schema ({
        contentType: {
            type: String,
            required: true
        },
        contentId: {
            type: Schema.Types.ObjectId, // either post or comment id
            required: true
        }
    }, {timestamps: true})],
    reports: [new Schema ({
        reportId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Report'
        },
        reportedBy: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
    }, {timestamps: true})],
    searchHistory: [new Schema ({
        query: {
            type: String,
            required: true
        }
    }, {timestamps: true})],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: false
    }],
    collections: [new Schema ({
        name: {
            type: String,
            required: true,
        },
        savedPosts: [new Schema ({
            postId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Post'
            }
        }, {timestamps: true})]
    }, {timestamps: true})],
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;