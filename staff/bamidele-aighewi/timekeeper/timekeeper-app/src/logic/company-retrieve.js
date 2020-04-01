// const context = require('./context')
// import { serverResponse } from '../utils'
const context = require('./context')
const { serverResponse } = require('../utils')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * This retrieves the current user's company
 */
module.exports = (function () {
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