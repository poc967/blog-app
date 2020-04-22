const Posts = require('../models/posts')

const createPost = async (request, response) => {
    const { title, category, post, author } = request.body

    if (!title || !category || !post || !author) {
        return response.status(400).json('All fields required: title, category, post')
    }

    const newPost = {
        title: title,
        author: author /* response.session.id - Session ID will eventually be captured during log in */,
        category: category,
        post: post
    }

    await Posts.create(newPost, function (error, newPost) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(201).json(newPost)
        }
    })
}

const getPosts = async (request, response) => {

    await Posts.find({ isDeleted: false }, function (error, posts) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(posts)
        }
    })
}

const getPostById = async (request, response) => {
    const id = request.params.identifier

    await Posts.findOne({ _id: id, isDeleted: false }, function (error, post) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(post)
        }
    })
}

const editPost = async (request, response) => {
    const { title, category, post } = request.body
    const id = request.params.identifier

    await Posts.findOneAndUpdate({ _id: id, isDeleted: false }, { title: title, category: category, post: post }, { new: true }, function (error, newPost) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(newPost)
        }
    })
}

const deletePost = async (request, response) => {
    const id = request.params.identifier

    await Posts.findByIdAndUpdate(id, { isDeleted: true }, { new: true }, function (error, deletedPost) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(deletedPost)
        }
    })
}

module.exports = { createPost, getPosts, getPostById, editPost, deletePost }