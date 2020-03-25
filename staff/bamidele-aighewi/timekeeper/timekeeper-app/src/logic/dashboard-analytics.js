import context from './context'
import { validate } from 'timekeeper-utils'
import { serverResponse } from '../utils'

const API_URL = process.env.REACT_APP_API_URL

export default (function (props = {}) {
    let queryParams = []

    const { date } = props

    if (typeof date !== 'undefined') {
        validate.date(date)
        queryParams.push(`date=${date}`)
    }

    queryParams = queryParams.join('&')
    if (!!queryParams) queryParams = `?${queryParams}`

    return (async () => {
        const response = await fetch(`${API_URL}/dashboard-analytics${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)