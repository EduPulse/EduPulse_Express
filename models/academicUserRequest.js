const mongoose = require('mongoose');
const {Schema} = mongoose;

const academicUserRequestSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    instituteID: {
        type: Schema.Types.ObjectId,
        ref: 'Institute',
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, {timestamps: true})

const AcademicUserRequest = mongoose.model('AcademicUserRequest', academicUserRequestSchema);

module.exports = AcademicUserRequest;