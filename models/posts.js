const mongoose = require('mongoose')
const ObjectId = require('mongoose').ObjectId

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    post: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String /* ObjectId - changed to string for testing purposes*/,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post 