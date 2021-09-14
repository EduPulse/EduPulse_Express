const mongoose = require('mongoose');
const {Schema} = mongoose;
const Institute = require('./institute');

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
        required: false,
        default: null
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
        required: false,
        default: null
    },
    role: {
        type: String,
        enum: [
            'none',
            'admin',
            'moderator',
            'academic',
            'general'
        ],
        default: 'none',
        required: true
    },
    academicInstitute: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        required: false
    },
    academic: new Schema ({
        state: {
            type: String,
            enum: [
                'none',
                'in review',
                'academic'
            ],
            required: false,
            default: 'none'
        },
        role: {
            type: String,
            enum: [
                'undergraduate',
                'staff',
                'lecturer'
            ],
            required: false,
        }
    }, {timestamps: true, _id: false}),
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
            type: String,
            enum: [
                'generated',
                'pushed',
                'viewed'
            ],
            required: false,
            default: 'generated'
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