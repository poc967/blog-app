const express = require('express')
const app = express()

app.all('*', (request, response) => {
    response.sendStatus(404)
})

const server = app.listen(8080, () => {
    console.log('Listening on port 8080...')
})

module.exports = server