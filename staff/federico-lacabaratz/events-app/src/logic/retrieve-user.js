const { validate } = require('events-utils')
const { NotAllowedError } = require('events-errors')

const API_URL = process.env.REACT_APP_API_URL

module.exports = token => {
    validate.string(token, 'token')
    validate.token(token)

    return (async() => {
        const res = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })

        const data = await res.json()

        const { error: _error } = data

        if(_error) {
            
            throw new NotAllowedError(_error)
        }
        const { name, surname, email} = data

        return {name, surname, email}
    })()
}