const User = require('../models/users')

const createUser = async (request, response, next) => {
    const { firstName, lastName, email, password } = request.body
    console.log(firstName, lastName, email, password)

    if (!firstName || !lastName || !email || !password) {
        return response.status(400).send('All fields required')
    }

    const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
    }

    User.create(userData, function (error, user) {
        if (error) {
            return response.status(400).send(error)
        } else {
            response.status(201).send(user)
        }
    })
}

const getAllUsers = async (request, response) => {
    const users = await User.find({})

    return response.status(200).send(users)
}

module.exports = { createUser, getAllUsers }