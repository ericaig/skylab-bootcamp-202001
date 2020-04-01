// const context = require('./context')
// import { validate } from 'timekeeper-utils'
// import { serverResponse } from '../utils'
const context = require('./context')
const { validate } = require('timekeeper-utils')
const { serverResponse } = require('../utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

module.exports = (function (props = {}) {
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