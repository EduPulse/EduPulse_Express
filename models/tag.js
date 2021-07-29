const mongoose = require('mongoose');
const {Schema} = mongoose;

const tagSchema = new Schema({
    verbose: {
        type: String,
        required: true
    }
}, {timestamps: true})

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;