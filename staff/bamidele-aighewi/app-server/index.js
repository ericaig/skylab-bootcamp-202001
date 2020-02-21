const express = require('express')
const logger = require('./utils/logger')
const path = require('path')
const loggerMidWare = require('./utils/logger-mid-ware')
const { authenticateUser, retrieveUser, registerUser } = require('./logic')
const bodyParser = require('body-parser')
const { Login, App, Home, Register, Landing } = require('./components')
const { sessions } = require('./data')
const url = require('url')

const cookieParser = require('cookie-parser')

const urlencodedBodyParser = bodyParser.urlencoded({ extended: false })

const { argv: [, , port = 8080] } = process

logger.level = logger.DEBUG
logger.path = path.join(__dirname, 'server.log')

logger.debug('setting up server')

const app = express()

app.use(cookieParser())
app.use(loggerMidWare)
app.use(express.static(path.join(__dirname, 'public')))
app.use(urlencodedBodyParser)

app.get('/', (req, res) => {
    const { token } = req.cookies

    if (!token)
        res.send(App({ title: 'My App', body: Landing(), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
    else res.redirect(`/home/${token}`)
})

app.get('/login', (req, res) => {
    const { token } = req.cookies

    if (!token) {
        res.send(App({ title: 'Login', body: Login(), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
    } else res.redirect(`/home/${token}`)
})

app.post('/authenticate', (req, res) => {
    const { username, password } = req.body

    try {
        authenticateUser(username, password)

        sessions.push(username)

        res.cookie('token', username, { expires: new Date(Date.now() + 900000), httpOnly: true })

        res.redirect(`/home/${username}`)
    } catch ({ message }) {
        res.send(App({ title: 'Login', body: Login({ error: message }), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
    }
})

app.get('/home/:username', (req, res) => {
    const { params: { username }, cookies: { token } } = req

    if (token === username && sessions.includes(username)) {
        const { name } = retrieveUser(username)

        res.send(App({ title: 'Home', body: Home({ name, username }), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
    } else if (token === username && !sessions.includes(username)) {
        sessions.push(token)
        res.redirect(`/home/${token}`)
    } else res.redirect('/login')
})

app.post('/logout', (req, res) => {
    const { body: { username } } = req

    // res.clearCookie('token')
    res.clearCookie(['token', 'cookieConsent'])

    const index = sessions.indexOf(username)

    sessions.splice(index, 1)

    res.redirect('/login')
})

app.post('/register', (req, res) => {
    const { name, surname, username, password } = req.body

    try {
        registerUser(name, surname, username, password)

        res.redirect('/login')
    } catch ({ message }) {
        res.send(App({ title: 'Register', body: Register({ error: message }), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
    }
})

app.get('/register', (req, res) => {
    res.send(App({ title: 'Register', body: Register(), cookieConsentHtml: Cookie({ accepted: cookieConsentAcceptd }) }))
})

app.post('/cookie-consent', (req, res) => {
    res.cookie('cookieConsent', 'yes', { expires: new Date(Date.now() + 900000), httpOnly: true })
    let backURL = req.header('Referer') || '/';

    backURL = url.parse(backURL).pathname

    console.log(backURL)

    res.redirect(backURL);
    // console.log('/login')

    // res.send('cookie-consent')
})

app.listen(port, () => logger.info(`server up and running on port ${port}`))

process.on('SIGINT', () => {
    logger.warn(`server abruptly stopped`)

    process.exit(0)
})