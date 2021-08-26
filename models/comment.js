const mongoose = require('mongoose');
const {Schema} = mongoose;

const voteSchema = new Schema({
    by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

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


const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;