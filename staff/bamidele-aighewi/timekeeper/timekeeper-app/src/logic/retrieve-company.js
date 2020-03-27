import { NotAllowedError } from 'timekeeper-errors'
import { serverResponse } from '../utils'
import context from './context'

//const { env: { REACT_APP_API_URL: API_URL } } = process

const API_URL = process.env.REACT_APP_API_URL

export default (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/company`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)