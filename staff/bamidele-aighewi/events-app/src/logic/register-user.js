import { fetch, validate } from '../utils'
//const {fetch, validate} = require('../utils')

export default function (name, surname, email, password) {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.email(email)
    validate.string(password, 'password')

    return fetch(`http://localhost:8085/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password })
    }).then(response => {

        if (response.status === 201) return
        else if (response.status === 409) {
            const { error } = JSON.parse(response.content)

            throw new Error(error)
        } else throw new Error('Unknown error')

    })
}