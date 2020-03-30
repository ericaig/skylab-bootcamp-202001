import { serverResponse } from '../utils'
import { validate } from 'timekeeper-utils'
const API_URL = process.env.REACT_APP_API_URL

export default function (token, name, surname, email, password) {
    validate.string(token, 'token')
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.email(email)
    validate.string(password, 'password')

    return (async () => {
        const response = await fetch(`${API_URL}/users/${token}/invite`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surname, email, password })
        })

        return await serverResponse(response)
    })()
}