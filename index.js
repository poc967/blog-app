const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/users')
const bodyParser = require('body-parser')

//Connection to MongoDB
mongoose.connect('mongodb://localhost:27017/blogapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.once('open', _ => {
    console.log('Database connected')
})

db.on('error', err => {
    console.error('connection error:', err)
})

//-----------------------------------------------------

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.post('/users', (request, response, next) => {
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
            return response.send(error)
        } else {
            response.send(user)
        }
    })
})

app.get('/users', async (request, response) => {
    const users = await User.find({})

    return response.send(users)
})

app.all('*', (request, response) => {
    response.sendStatus(404)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

module.exports = { server }