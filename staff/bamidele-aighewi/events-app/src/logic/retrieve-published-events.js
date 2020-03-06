import { validate } from 'events-utils'
const API_URL = process.env.REACT_APP_API_URL

export default function (token) {
    validate.string(token)
    const [, payload] = token.split('.')

    const { sub } = JSON.parse(atob(payload))

    if (!sub) throw new Error('no user id in token')

    return (async () => {
        const response = await fetch(`${API_URL}/users/published-events`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        const body = await response.json()

        if (response.status !== 200) throw new Error(body.error || 'Something went wrong')

        return body
    })()
}