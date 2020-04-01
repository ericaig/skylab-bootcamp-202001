require('dotenv').config()

const { env: { PORT = 8080, NODE_ENV: env, MONGODB_URL, TEST_MONGODB_URL }, argv: [, , port = PORT] } = process

const express = require('express')
const winston = require('winston')

const { name, version } = require('./package')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const { mongoose } = require('timekeeper-data')
const cors = require('cors')
const router = require('./routes')

// To supress deprecation warnings by mongoose
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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

        const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

        const app = express()

        app.use(cors())

        app.use(morgan('combined', { stream: accessLogStream }))

        app.use('/api/v1', router)

        app.listen(port, () => logger.info(`SUCCESS! Server ${name} ${version} is up and running on port ${port}`))

        process.on('SIGINT', () => {
            logger.info('server abruptly stopped')

            process.exit(0)
        })
    })