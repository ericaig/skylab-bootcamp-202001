const { serverResponse } = require('../utils')
const context = require('./context')
const fetch = require("node-fetch")
//const { env: { REACT_APP_API_URL: API_URL } } = process

const API_URL = process.env.REACT_APP_API_URL

module.exports = (function () {
    return (async () => {
        const response = await fetch(`${API_URL}/all-users`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)