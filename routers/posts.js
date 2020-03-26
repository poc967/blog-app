const express = require('express')
const postsRouter = express.Router()
const { createPost, getPosts, getPostById } = require('../controllers/posts')

postsRouter.get('/', getPosts)
postsRouter.get('/:identifier', getPostById)
postsRouter.post('/', createPost)
// postsRouter.patch('/:identifier', editPost)
// postsRouter.delete('/:identifier', deletePost)

module.exports = postsRouter