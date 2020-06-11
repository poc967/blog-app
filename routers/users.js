const express = require('express')
const usersRouter = express.Router()
const { authenticateUser, getUserFromToken, authorizeUser, clearToken } = require('../helpers/security')
const { createUser, getUsers, getUserById, updateUser, deleteUser } = require('../controllers/users')

usersRouter.post('/', createUser)
usersRouter.get('/', authorizeUser, getUserFromToken)
usersRouter.get('/:identifier', getUserById)
usersRouter.delete('/:identifier', deleteUser)
usersRouter.patch('/:identifier', updateUser)
usersRouter.post('/login', authenticateUser)
usersRouter.post('/logout', clearToken)

module.exports = usersRouter