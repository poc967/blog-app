const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const usersRouter = require('./routers/users')

//Connection to MongoDB

mongoose.connect(process.env.URL, {
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

app.use('/users', usersRouter)

app.all('*', (request, response) => {
    response.sendStatus(404)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

module.exports = { server }