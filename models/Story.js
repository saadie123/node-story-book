const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'public'
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments:[{
        commentBody:{
            type: String,
            required: true
        },
        commentDate:{
            type: Date,
            default: Date.now
        },
        commentUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = mongoose.model('stories', storySchema);