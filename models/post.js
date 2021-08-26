const mongoose = require('mongoose');
const {Schema} = mongoose;

const voteSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const versionSchema = new Schema({
    version: {
        type: Number,
        required: true,
        default: 0
    },
    title: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    readTime: {
        type: Number,
        required: true,
        default: 0
    },
    tags: [
        {
            type: Schema.Types.ObjectId,
            // ref: 'Tag'
        }
    ],
    contributer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
}, {timestamps: true});

const pinnedBySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        // TODO check this what is the need
        // required: true
    }
}, {timestamps: true});

const articleSchema = new Schema({
    status: {
        type: String,
        required: true,
        default: "published"
    },
    license: {
        type: String,
        required: true,
        default: "by"
    },
    current: versionSchema,
    versions: [ versionSchema ],
    upvotes: [ voteSchema ],
    downvotes: [ voteSchema ],
    pinnedBy: [ pinnedBySchema ],
    notificationSubscribers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

const pinSchema = new Schema({
    originalPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    pinComment: {
        type: String,
        required: false
    }
});

const commentSchema = new Schema({
    commenter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    upvotes: [ voteSchema ],
    downvotes: [ voteSchema ],
    notificationSubscribers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [ this ],
    reports: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Report'
        }
    ]
}, {timestamps: true});

const postSchema = new Schema({
    type: {
        type: String,
        required: true,
        default: "article"
    },
    // TODO add this
    viewCount:{
        type:Number,
        default:0
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // TODO need a confirmation for below commented entry
        // required: true
    },
    visibility: {
        type: String,
        required: true,
        default: "Anyone"
    },
    article: articleSchema,
    pin: pinSchema,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        }
    ],
    reports: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Report',
        }
    ]
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;