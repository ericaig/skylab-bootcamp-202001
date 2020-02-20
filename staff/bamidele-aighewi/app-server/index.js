const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('./middleware/bodyParser')
const user = require('./handlers/user')
const path = require('path')
const logger = require('./utils/logger')

const port = 8080

// body parser interceptor for forms
app.use(bodyParser)
app.use(express.static(path.join(__dirname, 'public')))

// let's configure logger
logger.level = logger.LOG
logger.path = path.join(__dirname, 'server.log')
logger.debug('setting up server')


// App's routes
router.route(['/', '/register', 'register.html'])
    .post(user.doRegister)
    .get(user.renderRegister)

router.route(['/login', '/login.html'])
    .post(user.doLogin)
    .get(user.renderLogin)

// launch app listener
app.listen(port, () => {
    logger.log(`App listening on port ${port}!`)
    console.log(`App listening on port ${port}!`)
})

process.on('SIGINT', () => {
    logger.warn(`server abruptly stopped`)

    process.exit(0)
})