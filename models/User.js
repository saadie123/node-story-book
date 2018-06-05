const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleID:String,
    name: String,
    email: String,
    photo: String
});

module.exports = mongoose.model('users',userSchema);