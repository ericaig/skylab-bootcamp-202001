import context from './context'
import { serverResponse } from '../utils'

const { validate } = require('timekeeper-utils')
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * This helps to create company specific events. Only Client's and Administrators can create these types of events
 * @param {string} start - Event start date -> expected format = YYYY-MM-DD
 * @param {string} end - Event end date -> expected format = YYYY-MM-DD
 * @param {number} type - Event type
 * @param {string} description - Brief description about the event
 */
export default (function (start, end, type, description) {
    validate.date(start)
    validate.date(end)
    validate.number(type, 'type')
    validate.string(description, 'description')

    return (async () => {
        const response = await fetch(`${API_URL}/events-company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({ start, end, type, description })
        })

        return await serverResponse(response)
    })()
}).bind(context)