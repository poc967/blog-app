const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const createUser = async (request, response) => {
    const { firstName, lastName, email, password } = request.body

    // validate all fields are provided
    if (!firstName || !lastName || !email || !password) {
        return response.status(400).json('All fields required')
    }

    // query to verify the user does not already exist in the database
    await User.findOne({ email }, async function (err, user) {
        if (user) {
            return response.status(400).json({ message: 'user already exists' })
        } else {
            const userData = await new User({
                firstName,
                lastName,
                email,
                password
            })

            // create the salt, hash the password and then update the user in the database
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(userData.password, salt, function (err, hash) {
                    if (err) throw new err
                    userData.password = hash
                    userData.save()

                    // sign and deliver the jwt
                    jwt.sign(
                        { id: userData.id },
                        process.env.jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err
                            return response.json({
                                token,
                                user: {
                                    id: userData.id,
                                    email: userData.email,
                                    firstName: userData.firstName
                                }
                            })
                        }
                    )

                })
            })
        }
    })
}

const getUsers = async (request, response) => {

    await User.find({ isDeleted: false }, function (error, users) {
        if (error) {
            return response.status(400).send(error)
        } else {
            return response.status(200).send(users)
        }
    })
}

const getUserById = async (request, response) => {
    const id = request.params.identifier

    await User.findOne(
        {
            _id: id,
            isDeleted: false
        },
        function (error, user) {
            if (error) {
                response.status(400).json(error)
            } else {
                response.status(200).json(user)
            }
        })
}

const updateUser = async (request, response) => {
    const paramsToUpdate = request.body
    const id = request.params.identifier

    await User.findOneAndUpdate({ _id: id, isDeleted: false }, paramsToUpdate, { new: true }, function (error, newUser) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(newUser)
        }
    })
}

const deleteUser = async (request, response) => {
    const id = request.params.identifier

    await User.findOneAndUpdate({
        _id: id,
        isDeleted: true
    }, {
        new: true
    },
        function (error, userToDelete) {
            if (error) {
                return response.status(400).json(error)
            } else {
                return response.status(200).json(userToDelete)
            }
        })
}

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser }