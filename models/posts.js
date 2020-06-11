const mongoose = require('mongoose')
const ObjectId = require('mongoose').ObjectId

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: ObjectId,
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