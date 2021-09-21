const mongoose = require('mongoose');
const {Schema} = mongoose;

const instituteSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    domain: {
        type: String,
        required: false
    }, 
    description: {
        type: String,
        required: false
    }, 
    coverImage: {
        type: String,
        required: false
    }, 
    contactDetails: new Schema ({
        email: {
            type: String,
            required: false
        }, 
        phoneNos: [{
            type: String,
            required: false
        }], 
        address: new Schema({
            line1: {
                type: String,
                required: false
            },
            line2: {
                type: String,
                required: false
            },
            city: {
                type: String,
                required: false
            },
            country: {
                type: String,
                required: false
            },
        })
    })
}, {timestamps: true})

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;