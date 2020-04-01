const context = require('./context')
const { serverResponse } = require('../utils')
const fetch = require("node-fetch")
const { validate } = require('timekeeper-utils')
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * Creates a sign in/out event
 */
module.exports = (function (emails) {
    validate.type(emails, 'emails', Array)
    emails.forEach(email => validate.email(email))

    return (async () => {
        const response = await fetch(`${API_URL}/send-invite-link`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({ emails })
        })

        return await serverResponse(response)
    })()
}).bind(context)