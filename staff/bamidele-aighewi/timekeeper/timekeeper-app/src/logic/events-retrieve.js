const context = require('./context')
const { serverResponse } = require('../utils')
const { validate } = require('timekeeper-utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * This retrieves company's events (WORK_DAY, WORK_HOLIDAY, USER_HOLIDAY...)
 * @param {string} start `Optional`. Event start date -> expected format = YYYY-MM-DD
 * @param {string} end `Optional`. Event end date -> expected format = YYYY-MM-DD
 * @param {number} state `Optional`. The state of the event. Pending/Accepted
 * @param {number} type `Optional`. Event type
 */
module.exports = (function (props = {}) {
    let queryParams = []

    const { start, end, type, state } = props

    if (typeof start !== 'undefined') {
        validate.date(start)
        queryParams.push(`start=${start}`)
    }

    if (typeof end !== 'undefined') {
        validate.date(end)
        queryParams.push(`end=${end}`)
    }

    if (typeof type !== 'undefined') {
        validate.type(type, 'type', Array)

        queryParams.push(`${type.map(item => `type[]=${item}`).join('&')}`)
    }

    if (typeof state !== 'undefined') {
        validate.number(state, 'state')
        queryParams.push(`state=${state}`)
    }

    queryParams = queryParams.join('&')
    if (!!queryParams) queryParams = `?${queryParams}`

    return (async () => {
        const response = await fetch(`${API_URL}/events${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)