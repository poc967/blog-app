const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const usersRouter = require('./routers/users')
const postsRouter = require('./routers/posts')


app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

//Connection to MongoDB

mongoose.connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})

const connection = mongoose.connection
connection.once('open', () => {
    console.log(`Database connected on: ${process.env.URL}`)
})

connection.on('error', error => {
    console.error('connection error:', error)
})

//-----------------------------------------------------

app.use('/users', usersRouter)
app.use('/posts', postsRouter)

app.all('*', (request, response) => {
    response.sendStatus(404)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

module.exports = { server }