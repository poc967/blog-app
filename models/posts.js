const mongoose = require('mongoose')

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
        type: ObjectId,
        required: true,
        trim: true,
    },
    category: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post 