const auth = require('basic-auth')
const bcrypt = require('bcryptjs')
const User = require('../models/users')

const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10)
}

const authenticateUser = async (request, response, next) => {
    let message = null

    const credentials = auth(request)

    if (credentials) {
        console.log(credentials.username)
        const user = await User.findOne(
            {
                email: credentials.username
            }
        )

        if (user) {
            const match = await bcrypt.compare(credentials.password, user.password)

            if (match) {
                console.log(`Authentication successful for username: ${user.username}`)

                request.currentUser = user
                return response.redirect('/')
            } else {
                message = `Authentication failure for username: ${user.email}`
            }

        } else {
            message = `User not found for username: ${credentials.username}`
        }

    } else {
        message = 'Auth header not found'
    }

    if (message) {
        console.warn(message)
        return response.status(301).json({ message: 'Access Denied' })
    } else {
        next()
    }
}

module.exports = authenticateUser