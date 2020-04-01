const context = require('./context')
const { serverResponse } = require('../utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

module.exports = (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/week-days`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)