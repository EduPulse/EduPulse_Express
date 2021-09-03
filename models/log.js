const mongoose = require('mongoose');
const {Schema} = mongoose;

const logSchema = new Schema({
    v: {
        type: String,
        required: true
    }
}, {
    timestamps: false,
    versionKey: false
})

const Log = mongoose.model('Log', logSchema);

module.exports = Log;