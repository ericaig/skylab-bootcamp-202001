const path = require('path')
const fs = require('fs')
const logger = require('../utils/logger')

function doRegister(req, res) {
    console.log(req.body)
    res.send('register fnc')
    // next()
}

function renderRegister(req, res) {
    try {
        logger.debug('Rendering register page')
        res.status(200).sendFile(path.join(__dirname, '../public/register.html'))
    } catch (error) {
        console.log(error)
        logger.error(error.message)
    }
}

function doLogin(req, res) {
    console.log(req.body)
    res.send('login fnc')
    // next()
}

function renderLogin(req, res) {
    try {
        logger.debug('Rendering login page')

        res.status(200).sendFile(path.join(__dirname, '../public/login.html'))
    } catch (error) {
        console.log(error)
        logger.error(error.message)
    }
}

module.exports = {
    doRegister,
    renderRegister,
    doLogin,
    renderLogin,
}