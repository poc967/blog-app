const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticateUser = async (request, response, next) => {
    const { email, password } = request.body

    if (!email || !password) {
        return response.status(400).json({ message: 'All fields required' })
    }

    await User.findOne({ email }, async function (err, user) {
        if (!user) {
            return response.status(400).json({ message: 'user does not exist' })
        } else {
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return response.status(400).json({ message: 'invalid credentials' })
            } else {
                jwt.sign(
                    { id: user.id },
                    process.env.jwtSecret,
                    { expiresIn: 3600 },
                    (err, token) => {
                        if (err) throw err
                        return response.cookie(
                            'token',
                            token,
                            { httpOnly: true }
                        ).json({
                            id: user.id,
                            email: user.email,
                            firstName: user.firstName
                        })
                    }
                )
            }
        }
    })
}

const authorizeUser = (request, response, next) => {
    const token = request.cookies.token

    if (!token) {
        return response.status(401).json({ message: 'no token found, authorization denied' })
    } else {
        try {
            const decodedToken = jwt.verify(token, process.env.jwtSecret)
            request.user = decodedToken
            next()
        } catch (e) {
            return response.clearCookie('token').status(401).json({ message: 'bad token' })
        }
    }
}

const clearToken = (request, response) => {
    const token = request.cookies.token

    if (token) {
        return response.clearCookie('token').status(200).json({ message: 'token cleared successfully' })
    } else {
        return response.status(400).json({ message: 'no token found' })
    }
}

const getUserFromToken = async (request, response) => {
    try {
        const currentUser = await User.findById(request.user.id).select('-password')
        if (!currentUser) throw new Error('user does not exist')
        const { _id, email, firstName } = currentUser
        return response.status(201).send({ _id, email, firstName })
    } catch (error) {
        return response.status(400).json(error)
    }
}

module.exports = { authorizeUser, authenticateUser, getUserFromToken, clearToken }