const mongoose = require('mongoose');
const {Schema} = mongoose;

const advertisement = new Schema({
    starting: {
        type: Date,
        required: true
    },
    validTill: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    video: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    redirectLink: {
        type: String,
        required: true
    },
    relatedTags: [{
        type: Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    paymentDetails: new Schema({
        paymentMethod: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
    }, {timestamps: true})
}, {timestamps: true})

const advertiser = new Schema({
    publicName: {
        type: String,
        required: true
    },
    contactDetails: new Schema({
        email: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        }
    }),
    avatar: {
        type: String
    },
    cloudinary_id: {
        type: String
    },
    advertisements: [ advertisement ]
}, {timestamps: true})

const Advertiser = mongoose.model('Advertiser', advertiser);

module.exports = Advertiser;