import {validate} from 'events-utils'

export default function (token) {
    validate.string(token, 'token')

    const [, payload] = token.split('.')

    const { sub } = JSON.parse(atob(payload))

    if (!sub) throw new Error('no user id in token')

    return fetch(`http://localhost:8085/users/`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res=>res.json())
    .then(data => {
        const { error: _error } = data

        if (_error) throw new Error(_error)

        const { name, surname, email } = data

        return { name, surname, email }
    })
}