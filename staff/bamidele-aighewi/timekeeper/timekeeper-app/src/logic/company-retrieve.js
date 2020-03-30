import context from './context'
import { serverResponse } from '../utils'

const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * This retrieves the current user's company
 */
export default (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/company`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)