// const context = require('./context')
// import { serverResponse } from '../utils'
const context = require('./context')
const { serverResponse } = require('../utils')
const fetch = require("node-fetch")
const { validate } = require('timekeeper-utils')
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * Creates a sign in/out event
 */
module.exports = (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/events-sign-in-out`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)