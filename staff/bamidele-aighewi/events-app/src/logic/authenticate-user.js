import { validate } from 'events-utils'
const API_URL = process.env.REACT_APP_API_URL

export default function (email, password) {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return fetch(`${API_URL}/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
        .then(response => response.json())
        .then(response => {
            const { error: _error, token } = response

            if (_error) throw new Error(_error)

            return token
        })
}