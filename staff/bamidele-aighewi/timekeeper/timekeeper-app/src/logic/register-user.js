const { userCreateValidate } = require('../utils')
const { NotAllowedError } = require('timekeeper-errors')
const fetch = require("node-fetch")
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (name, surname, email, password) {
    userCreateValidate(name, surname, email, password)

    return (async () => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password })
        })

        const { status } = response

        if (status === 201) return

        if (status >= 400 && status < 500) {
            const { error } = await response.json()

            if (status === 409) {
                throw new NotAllowedError(error)
            }

            throw new Error(error)
        }

        throw new Error('server error')
    })()
}