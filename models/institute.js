const mongoose = require('mongoose');
const {Schema} = mongoose;

const instituteSchema = new Schema({
    name: {
        type: String,
        required: true
    }, 
    domain: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: true
    }, 
    coverImage: {
        type: String,
        required: true
    }, 
    contactDetails: new Schema ({
        email: {
            type: String,
            required: true
        }, 
        phoneNos: [{
            type: String,
            required: false
        }], 
        address: new Schema({
            line1: {
                type: String,
                required: true
            },
            line2: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
        })
    })
}, {timestamps: true})

const Institute = mongoose.model('Institute', instituteSchema);

module.exports = Institute;