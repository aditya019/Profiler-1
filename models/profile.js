const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        // lowercase: true (while at development phase)
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    bio: String,
    profilePic: {
        type: String,
        default: 'https://images.unsplash.com/photo-1489034105530-f46eb91f1e27?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29uJTIwc2hhZG93fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'
    },
    backgroundPic: {
        type: String,
        default: 'https://images.unsplash.com/photo-1613645695025-20e3f38de4a6?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDF8aVVJc25WdGpCMFl8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60'
    },
    posts: [{image: String, story: String}],
    loggedIn: Boolean
});

module.exports = mongoose.model('Profile', profileSchema);