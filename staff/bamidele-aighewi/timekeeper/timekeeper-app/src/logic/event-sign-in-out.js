import context from './context'
import { serverResponse } from '../utils'

const { validate } = require('timekeeper-utils')
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * Creates a sign in/out event
 */
export default (function () {
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