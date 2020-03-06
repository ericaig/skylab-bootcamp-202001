const { validate } = require('events-utils')
const API_URL = process.env.REACT_APP_API_URL

module.exports = function (email, password) {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')


    return (async () => {
        const response = await fetch(`${API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const body = await response.json()

        const { error: _error, token } = body

        if (_error) throw new Error(_error)

        return token
    })()
}