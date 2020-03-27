const express = require('express')
const usersRouter = express.Router()
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users')

usersRouter.post('/', createUser)
usersRouter.get('/', getUsers)
usersRouter.get('/:identifier', getUserById)
usersRouter.delete('/:identifier', deleteUser)
usersRouter.patch('/:identifier', updateUser)

module.exports = usersRouter