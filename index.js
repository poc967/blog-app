const express = require('express')
const app = express()
const dotenv = require('dotenv').config()

app.all('*', (request, response) => {
    response.sendStatus(404)
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`)
})

module.exports = { server }