// const context = require('./context')
// import { serverResponse } from '../utils'
// import { validate } from 'timekeeper-utils'
const context = require('./context')
const { serverResponse } = require('../utils')
const { validate } = require('timekeeper-utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

module.exports = (function (start, end, type, state) {
    let queryParams = []

    validate.date(start)
    validate.date(end)

    if (typeof type !== 'undefined') {
        validate.number(type, 'type')
        queryParams.push(`type=${type}`)
    }

    if (typeof state !== 'undefined') {
        validate.number(state, 'state')
        queryParams.push(`state=${state}`)
    }

    queryParams = queryParams.join('&')
    if (!!queryParams) queryParams = `?${queryParams}`

    return (async () => {
        const response = await fetch(`${API_URL}/events-company/${start}/${end}${queryParams}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)