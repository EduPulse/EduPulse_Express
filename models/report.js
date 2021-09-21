const mongoose = require('mongoose');
const {Schema} = mongoose;

const reportSchema = new Schema({
    reportedBy: {
        type: Schema.Types.ObjectId, ref: 'User',
        required: true
    }, 
    type: {
        type: String,
        enum: [
            'post',
            'comment',
            'user'
        ],
        required: false
    },
    status: {
        type: String,
        enum: [
            'open',
            'closed',
            'in review'
        ],
        default: "open"
    },
    category: {
        type: String,
        enum: [
            'spam',
            'harassment',
            'content ownership',
            'other'
        ],
        required: false
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }, 
    against: new Schema ({
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }, 
        userInstitute: {
            type: Schema.Types.ObjectId,
            ref: 'Institute'
        }, 
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }, 
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    }),
    comment: {
        type: String,
        required: false
    }
}, {timestamps: true})

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;