const { validate } = require('events-utils')

const API_URL = process.env.REACT_APP_API_URL

/**
 * Checks user credentials against the storage
 * 
 * @param {string} email user's unique e-mail
 * @param {string} password user's password
 * 
 * @returns {Promise<string>} user id from storage
 * 
 * @throws {ContentError} if user data does not follow the format and content rules
 * @throws {TypeError} if user data does not have the correct type
 * @throws {NotAllowedError} on wrong credentials
 */
export default (email, password) => {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return (async () => {
        const res = await fetch(`${API_URL}/users/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })

        const { token } = await res.json()

        if (!token.length) throw new Error(`wrong credentials`)

        return token
    })()

}