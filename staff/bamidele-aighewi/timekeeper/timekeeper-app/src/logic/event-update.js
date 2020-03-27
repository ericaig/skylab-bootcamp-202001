import context from './context'
import { serverResponse } from '../utils'
const { validate } = require('timekeeper-utils')

const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * To update company's week days
 * @param {string} eventId ID of Event to update
 * @param {object} props Properties of event to update
 */
export default (function (eventId, props) {
    validate.string(eventId, 'eventId')
    validate.object(props, 'props')

    // debugger

    return (async () => {
        const response = await fetch(`${API_URL}/events/${eventId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(props),
        })

        return await serverResponse(response)
    })()
}).bind(context)