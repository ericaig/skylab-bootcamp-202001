const { validate } = require('events-utils')
const { NotAllowedError } = require('events-errors')

const API_URL = process.env.REACT_APP_API_URL

module.exports = (name, surname, email, password) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async () => {
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password })
        })

        if (response.status === 201) return

        const { error } = await response.json()
        
        if (response.status === 409) {

            throw new NotAllowedError(error)

        } else throw new Error('Unknown error')
    })()

}