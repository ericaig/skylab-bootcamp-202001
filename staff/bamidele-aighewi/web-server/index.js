const express = require('express')
const logger = require('./utils/logger')
const app = express()
const __PORT__ = 8080


app.get('/*', (req, res) => {
    res.send('Hello World!')
})

app.listen(__PORT__, () => logger.log(`Example app listening on port ${__PORT__}!`))