const Posts = require('../models/posts')

const createPost = (request, response) => {
    const { title, category, post } = request.body

    if (!title || !category || !post) {
        return response.status(400).json('All fields required: title, category, post')
    }

    const newPost = {
        title: title,
        author: response.session.id,
        category: category,
        post: post
    }

    Posts.create(newPost, function (error, newPost) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(201).json(newPost)
        }
    })
}

module.exports = { createPost }