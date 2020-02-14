/**
 * @param {string} username - The user's username for logging in
 * @param {string} password  - The user's password for logging in
 * @param {function} callback - Callback to execute after authentication. It returns error and token
 * @throws Will throw an error if an argument doesn't match it's type
 */

function authenticateUser(username, password, callback) {
    if (typeof username !== 'string') throw new TypeError(`username ${username} is not a string`)
    if (!username.trim()) throw new Error(`username ${username} is empty`)
    if (typeof password !== 'string') throw new TypeError(`password ${password} is not a string`)
    if (!password.trim()) throw new Error(`password is empty`)
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    call(`https://skylabcoders.herokuapp.com/api/v2/users/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }, (error, response) => {
        if (error) return callback(error)

        const { error: _error, token } = JSON.parse(response.content)

        if (_error) return callback(new Error(_error))

        callback(undefined, token)
    })
}