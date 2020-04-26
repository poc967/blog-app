const express = require('express')
const postsRouter = express.Router()
const { authorizeUser } = require('../helpers/security')
const { createPost, getPosts, getPostById, editPost, deletePost } = require('../controllers/posts')

postsRouter.get('/', getPosts)
postsRouter.get('/:identifier', getPostById)
postsRouter.post('/', authorizeUser, createPost)
postsRouter.patch('/:identifier', authorizeUser, editPost)
postsRouter.delete('/:identifier', authorizeUser, deletePost)

module.exports = postsRouter