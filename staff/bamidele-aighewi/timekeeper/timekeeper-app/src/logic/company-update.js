// const context = require('./context')
// import { serverResponse } from '../utils'
const context = require('./context')
const { serverResponse } = require('../utils')
const { validate } = require('timekeeper-utils')
const fetch = require("node-fetch")

const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * To update company's details
 */
module.exports = (function (props) {
    validate.object(props, 'props')
    
    return (async () => {
        const response = await fetch(`${API_URL}/company`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify(props),
        })

        return await serverResponse(response)
    })()
}).bind(context)