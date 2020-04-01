// const context = require('./context')
// import { serverResponse } from '../utils'
const context = require('./context')
const { serverResponse } = require('../utils')
const { validate } = require('timekeeper-utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * To delete an event
 * @param {string} eventId ID of Event to delete
 */
module.exports = (function (eventId) {
    validate.string(eventId, 'eventId')

    return (async () => {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)