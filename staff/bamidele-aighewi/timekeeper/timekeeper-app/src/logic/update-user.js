import context from './context'
import { serverResponse } from '../utils'
const { validate } = require('timekeeper-utils')

const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * To update user's details
  * @param {object} props Properties of user to update
 */
export default (function (props, id) {
    let queryParams = []
    
    validate.object(props, 'props')

    if (typeof id !== 'undefined') {
        validate.string(id, 'id')
        queryParams.push(`id=${id}`)
    }

    queryParams = queryParams.join('&')
    if (!!queryParams) queryParams = `?${queryParams}`
    
    return (async () => {
        const response = await fetch(`${API_URL}/user${queryParams}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(props)
        })

        return await serverResponse(response)
    })()
}).bind(context)