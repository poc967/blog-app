const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    post: {
        type: String
    }
})

const Post = mongoose.model('Post', PostSchema)
module.exports = { Post }