//const Posts = require('../models/posts')

const createPost = (request, response) => {
    const { title, category, post } = request.body

    if (!title || !category || !post) {
        return response.status(400).json('All fields required: title, category, post')
    }

    console.log(response.locals.currentUser)
}

module.exports = { createPost }