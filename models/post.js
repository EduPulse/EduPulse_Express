const mongoose = require('mongoose');
const {Schema} = mongoose;

const versionSchema = new Schema({
    version: {
        type: Number,
        required: true,
        default: 0
    },
    title: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    readTime: {
        type: Number,
        required: true,
        default: 0
    },
    tags: [String], //change to ObjectId
    contributer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
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
        default: "CC0"
    },
    versions: [
        versionSchema
    ]
});

const postSchema = new Schema({
    type: {
        type: String,
        required: true,
        default: "article"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        // set: s => (typeof(s) === "string") ? Schema.Types.ObjectId(s) : s
    },
    visibility: {
        type: String,
        required: true,
        default: "visible"
    },
    article: articleSchema
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema);

module.exports = Post;