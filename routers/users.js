const express = require('express')
const mongoose = require('mongoose')
const usersRouter = express.Router()
const { createUser, getAllUsers } = require('../controllers/users')

usersRouter.post('/', createUser)
usersRouter.get('/', getAllUsers)

module.exports = usersRouter