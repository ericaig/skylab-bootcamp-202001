require('dotenv').config()

const { env: { PORT = 8080, NODE_ENV: env, MONGODB_URL }, argv: [, , port = PORT] } = process

const express = require('express')
const winston = require('winston')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    createEvent,
    retrievePublishedEvents,
    retrieveLastEvents,
    updateEvent,
    deleteEvent,
    subscribeToEvent,
    unSubscribeFromEvent,
    retrieveSubscribedEvents,
    retrieveAllEvents,
} = require('./routes')
const { name, version } = require('./package')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { jwtVerifierMidWare } = require('./mid-wares')
const { database } = require('./data')

database.connect(MONGODB_URL)
    .then(() => {
        const logger = winston.createLogger({
            level: env === 'development' ? 'debug' : 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'server.log' })
            ]
        })

        if (env !== 'production') {
            logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }))
        }

        const jsonBodyParser = bodyParser.json()

        const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

        const app = express()

        app.use(morgan('combined', { stream: accessLogStream }))

        app.post('/users', jsonBodyParser, registerUser)

        app.post('/users/auth', jsonBodyParser, authenticateUser)

        app.get('/users', jwtVerifierMidWare, retrieveUser)

        app.post('/users/:id/events', [jwtVerifierMidWare, jsonBodyParser], createEvent)
        app.patch('/users/:id/events', [jwtVerifierMidWare, jsonBodyParser], subscribeToEvent)
        app.patch('/users/:id/unsubscribe-event', [jwtVerifierMidWare, jsonBodyParser], unSubscribeFromEvent)
        app.get('/users/:id/subscribed-events', jwtVerifierMidWare, retrieveSubscribedEvents)

        app.get('/users/:id/published-events', jwtVerifierMidWare, retrievePublishedEvents)
        app.get('/users/:id/last-events', jwtVerifierMidWare, retrieveLastEvents)
        app.patch('/events/:id', [jwtVerifierMidWare, jsonBodyParser], updateEvent)
        app.get('/events', jwtVerifierMidWare, retrieveAllEvents)
        app.delete('/events/:id', jwtVerifierMidWare, deleteEvent)

        app.listen(port, () => logger.info(`server ${name} ${version} up and running on port ${port}`))

        process.on('SIGINT', () => {
            logger.info('server abruptly stopped')

            process.exit(0)
        })
    }).catch(({ message }) => {
        console.error(`Something went wrong connecting to DB: ${message}`)
    })