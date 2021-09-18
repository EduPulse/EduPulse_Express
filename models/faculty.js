const mongoose = require('mongoose');
const {Schema} = mongoose;

const facultySchema = new Schema({
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
        required: false
    }, 
    coverImage: {
        type: String,
        required: false
    }, 
    contactDetails: new Schema ({
        email: {
            type: String,
            required: true
        }, 
        phoneNos: [{
            type: String,
            required: true
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

const Faculty = mongoose.model('Faculty', facultySchema);

module.exports = Faculty;