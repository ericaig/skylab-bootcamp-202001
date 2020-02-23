const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const url = require('url')

const { logger, loggerMidWare } = require('./utils')
const {
    authenticateUser,
    retrieveUser,
    registerUser,
    searchVehicles,
    toggleFavVehicle,
    retrieveStyle,
    retrieveVehicle
} = require('./logic')

const { Login,
    App,
    Search,
    Register,
    Landing,
    Results,
    Detail,
} = require('./components')

const urlencodedBodyParser = bodyParser.urlencoded({ extended: false })

const { argv: [, , port = 8080] } = process

logger.level = logger.DEBUG
logger.path = path.join(__dirname, 'server.log')

logger.debug('setting up server')

const app = express()

// app.use(loggerMidWare)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/components', express.static(path.join(__dirname, 'components'))) // NOTE to see sass files in browser
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: true }))

app.get('/', (req, res) => {
    const { session: { token, acceptCookies } } = req

    try {
        retrieveUser(token, (error, { username }) => {
            if (error)
                return res.send(App({ title: 'My App', body: Landing(), acceptCookies }))

            if (username) return res.redirect(`/search/${username}`)

            // const { session: { acceptCookies } } = req

            res.send(App({ title: 'My App', body: Landing(), acceptCookies }))
        })
    } catch ({ message }) {
        res.send(App({ title: 'My App', body: Landing(), acceptCookies }))
    }
})

app.get('/login', (req, res) => {
    const { session: { username } } = req

    if (username) return res.redirect(`/search/${username}`)

    const { session: { acceptCookies } } = req

    res.send(App({ title: 'Login', body: Login(), acceptCookies }))
})

app.post('/login', urlencodedBodyParser, (req, res) => {
    const { body: { username, password }, session } = req

    try {
        authenticateUser(username, password, (error, token) => {
            if (error) {
                const { message } = error
                const { session: { acceptCookies } } = req

                return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
            }

            retrieveUser(token, (error, user) => {
                if (error) {
                    const { message } = error
                    const { session: { acceptCookies } } = req

                    return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
                }

                const { username } = user

                session.token = token
                session.username = username

                res.redirect(`/search/${username}`)
            })
        })
    } catch ({ message }) {
        const { session: { acceptCookies } } = req

        res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
    }
})

app.get('/search/:username', (req, res) => {
    const { params: { username }, session: { token } } = req
    try {

        const { query } = url.parse(req.url, true).query

        retrieveUser(token, (error, user) => {
            if (error) {
                const { message } = error
                const { session: { acceptCookies } } = req

                return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
            }

            if (!!query) {
                searchVehicles(token, query, (error, vehicles) => {
                    if (error) return res.redirect('/login')

                    const { username: _username } = user

                    if (username === _username) {
                        const { name } = user

                        const { session: { acceptCookies } } = req

                        let body = Search({ name, username, query })
                        body += Results({ results: vehicles })

                        res.send(App({ title: 'Search', body: body, acceptCookies }))
                    } else res.redirect('/login')
                })
            } else {
                const { username: _username } = user

                if (username === _username) {
                    const { name } = user

                    const { session: { acceptCookies } } = req

                    let body = Search({ name, username, query })
                    // body += Results({ results: vehicles })

                    res.send(App({ title: 'Search', body: body, acceptCookies }))
                } else res.redirect('/login')
            }
        })
    } catch (e) {
        res.redirect('/login')
    }
})

app.all('/logout', urlencodedBodyParser, ({ session }, res) => {
    session.destroy(() => res.redirect('/login'))
})

app.post('/register', urlencodedBodyParser, (req, res) => {
    const { body: { name, surname, username, password } } = req

    try {
        registerUser(name, surname, username, password, error => {
            if (error) {
                const { message } = error
                const { session: { acceptCookies } } = req
                return res.send(App({ title: 'Register', body: Register({ error: message }), acceptCookies }))
            }

            res.redirect('/login')
        })
    } catch ({ message }) {
        const { session: { acceptCookies } } = req

        res.send(App({ title: 'Register', body: Register({ error: message }), acceptCookies }))
    }
})

app.get('/register', ({ session: { acceptCookies } }, res) => {
    res.send(App({ title: 'Register', body: Register(), acceptCookies }))
})

app.post('/accept-cookies', (req, res) => {
    const { session } = req

    session.acceptCookies = true

    res.redirect(req.get('referer'))
})

app.post('/toggleFav/:id', (req, res) => {
    const { id } = req.params

    try {
        const { session: { token } } = req

        toggleFavVehicle(token, id, error => {
            if (error)
                return res.redirect(req.get('referer'))

            const { params: { query }, session: { username } } = req

            if (query) {

                if (username) return res.writeHead(301, { Location: req.get('referer') })

                res.redirect('/login')
            } else {
                res.writeHead(301, { Location: req.get('referer') })
                res.end()
            }
        })
    } catch (error) {
        res.redirect(req.get('referer'))
    }
})

app.get('/detail/:id', (req, res) => {
    const { id } = req.params

    try {
        const { session: { token } } = req

        retrieveUser(token, (error, user) => {
            if (error) {
                return res.redirect(req.get('referer') || '/login')
            } else if (!user) return res.redirect('/logout')

            retrieveVehicle(token, id, (error, vehicle) => {
                if (error) {
                    logger.debug(error.message)
                    return res.redirect(req.get('referer'))
                }

                retrieveStyle(vehicle.style, (error, style) => {
                    if (error) {
                        logger.debug(error.message)
                        return res.redirect(req.get('referer'))
                    }

                    const { session: { acceptCookies } } = req
                    const { name, username } = user

                    let body = Search({ name, username })
                    body += Detail({ vehicle, style })

                    // res.send('everything is ok with detail')
                    res.send(App({ title: 'Detail', body, acceptCookies }))
                })
            })
        })
    } catch (error) {
        logger.debug(error.message)
        res.redirect(req.get('referer') || '/login')
    }
})

app.listen(port, () => logger.info(`server up and running on port ${port}`))

process.on('SIGINT', () => {
    logger.warn(`server abruptly stopped`)

    process.exit(0)
})