const User = require('../models/users')

const createUser = async (request, response) => {
    const { firstName, lastName, email, password } = request.body

    if (!firstName || !lastName || !email || !password) {
        return response.status(400).json('All fields required')
    }

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }

    User.create(userData, function (error, user) {
        if (error) {
            return response.status(400).json(error)
        } else {
            response.status(201).json(user)
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

    await User.find({
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

    await User.findByIdAndUpdate(id, paramsToUpdate, { new: true }, function (error, newUser) {
        if (error) {
            return response.status(400).json(error)
        } else {
            return response.status(200).json(newUser)
        }
    })
}

const deleteUser = async (request, response) => {
    const id = request.params.identifier

    await User.findByIdAndUpdate(id, {
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