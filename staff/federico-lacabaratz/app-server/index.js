const express = require('express')
const { logger, loggerMidWare } = require('./utils')
const path = require('path')
const { authenticateUser, retrieveUser, registerUser, searchVehicles, retrieveVehicle, toggleFavVehicle, retrieveFavVehicles } = require('./logic')
const bodyParser = require('body-parser')
const session = require('express-session')
const { Login, App, Search, Register, Landing, Results, Item, Detail } = require('./components')

const urlencodedBodyParser = bodyParser.urlencoded({ extended: false })

const { argv: [, , port = 8080] } = process

logger.level = logger.DEBUG
logger.path = path.join(__dirname, 'server.log')

logger.debug('setting up server')

const app = express()

app.use(loggerMidWare)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/components', express.static(path.join(__dirname, 'components'))) // NOTE to see sass files in browser
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1000 * 60 * 60 * 24 }, resave: false, saveUninitialized: true }))

app.get('/', ({ session: { acceptCookies } }, res) => {
    res.send(App({ title: 'My App', body: Landing(), acceptCookies }))
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

                session.token = token

                const { username } = user

                res.redirect(`/search/${username}`)
            })
        })
    } catch ({ message }) {
        const { session: { acceptCookies } } = req

        res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
    }
})

app.get('/search/:username', (req, res) => {
    const { params: { username }, session: { token, acceptCookies } } = req

    try {
        retrieveUser(token, (error, user) => {
            if (error) {
                const { message } = error
                const { session: { acceptCookies } } = req
                return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
            }

            const { username: _username } = user

            if (username === _username) {
                const { name } = user

                res.send(App({ title: 'Search', body: Search({ name }), acceptCookies }))

            }
        })

    } catch (error) {
        const { message } = error

        return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
    }
})

app.get('/search', (req, res) => {
    const { params: { username }, session: { token, acceptCookies }, query } = req
    req.session.query = query

    try {
        retrieveUser(token, (error, user) => {
            if (error) {
                const { message } = error
                const { session: { acceptCookies } } = req
                return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
            }
            const { name } = user
            const _query = query.query

            searchVehicles(token, _query, (error, vehicles) => {
                if (error) {

                    return res.send(App({ title: 'Search', body: Search({ error: message }), acceptCookies }))
                }
                return res.send(App({ title: 'Search', body: Search({ name, vehicles }), acceptCookies }))
            })
        })

    } catch (error) {
        const { message } = error

        return res.send(App({ title: 'Login', body: Login({ error: message }), acceptCookies }))
    }
})

app.get('/favourites/:name', (req, res) => {
    const { session: { acceptCookies, token }, params: { name } } = req
    try {
        retrieveFavVehicles(token, (error, vehicles) => {
            if (error) {
                res.send(App({ title: 'Search', body: Search({ name, error }), acceptCookies }))
            }
            else {
                res.send(App({ title: 'favourites', body: Search({ name, vehicles }), acceptCookies }))
            }
        })
    } catch ({ message }) {
        res.send(App({ title: 'Search', body: Search({ name, error: message }), acceptCookies }))
    }
})
app.post('/toggle-fav/:id', urlencodedBodyParser, (req, res) => {
    const { session: { token, acceptCookies }, params: { id } } = req

    try {
        toggleFavVehicle(token, id, error => {
            if (error)
                res.send(App({ title: 'Search', body: Search({ name, error: message }), acceptCookies }))
            else
                res.redirect(req.get('referer'))
        })

    } catch (error) {
        res.send(App({ title: 'Search', body: Search({ name, error: message }), acceptCookies }))
    }
})

app.post('/logout', urlencodedBodyParser, ({ session }, res) => {
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
        })

        res.redirect('/login')
    } catch ({ message }) {
        const { session: { acceptCookies } } = req

        res.send(App({ title: 'Register', body: Register({ error: message }), acceptCookies }))
    }
})

app.get('/register', ({ session: { acceptCookies } }, res) => {
    res.send(App({ title: 'Register', body: Register(), acceptCookies }))
})

app.get('/detail/:id', (req, res) => {
    const { session: { acceptCookies, token }, params: { id } } = req
    retrieveVehicle(token, id, (error, detail) => {
        if (error)
            res.redirect(req.get('referer'))
        if (detail)
            res.send(App({ title: `${detail.name}`, body: Detail({ detail }), acceptCookies }))
    })
})
app.get('/back', (req, res) => {
    const { session: { query } } = req
    res.redirect(`/search?query=${query.query}`)
})

app.post('/accept-cookies', (req, res) => {
    const { session } = req

    session.acceptCookies = true

    res.redirect(req.get('referer'))
})

app.listen(port, () => logger.info(`server up and running on port ${port}`))

process.on('SIGINT', () => {
    logger.warn(`server abruptly stopped`)

    process.exit(0)
})