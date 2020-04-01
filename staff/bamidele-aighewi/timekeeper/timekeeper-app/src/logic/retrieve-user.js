const { serverResponse } = require('../utils')
const context = require('./context')
const {validate} = require('timekeeper-utils')
const fetch = require("node-fetch")
//const { env: { REACT_APP_API_URL: API_URL } } = process

const API_URL = process.env.REACT_APP_API_URL

module.exports = (function (id) {
    let queryParams = []

    if(typeof id !== 'undefined'){
        validate.string(id, 'id')
        queryParams.push(`id=${id}`)
    }

    queryParams = queryParams.join('&')
    if (!!queryParams) queryParams = `?${queryParams}`

    return (async () => {
        const response = await fetch(`${API_URL}/users${queryParams}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            }
        })

        return await serverResponse(response)
    })()
}).bind(context)