import { validate } from 'events-utils'
const API_URL = process.env.REACT_APP_API_URL

export default function (token, title, description, location, date) {
    validate.string(token, 'token')
    validate.string(title, 'title')
    validate.string(description, 'description')
    validate.string(location, 'location')
    validate.type(date, 'date', Date)

    return (async () => {
        const response = await fetch(`${API_URL}/users/events`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, description, location, date })
        })

        if (response.status === 201) return

        const body = await response.json()
        const { error } = body

        throw new Error(error)
    })()
}