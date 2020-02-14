/**
 * @param {string} token - User's authorization token. To update user's details
 * @param {object} newUser - An object containing the user's details
 * @param {function} callback - Callback to execute after updating user's details. It returns error on failure and nothing on success
 * @throws Will throw an error if an argument doesn't match it's type
 */

function updateUser(token, newUser, callback) {
    if (typeof token !== 'string') throw new TypeError(`token ${token} is not a string`)
    if (!token.trim()) throw new Error(`token ${token} is empty`)
    if (typeof newUser !== "object") throw new TypeError(`newUser ${newUser} is not an object`)
    if (typeof callback !== 'function') throw new TypeError(`callback ${callback} is not a function`)
    if (newUser.oldPassword && !newUser.password) throw new Error(`new password must be completed`)
    if (!newUser.oldPassword && newUser.password) throw new Error(`old password must be completed`)

    for (const key in newUser)
        if (!newUser[key]) delete newUser[key]

    call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`},
        body: JSON.stringify(newUser)
    }, (error, response) => {
        if (error) return callback(error)
        if (response.content) {
            const { error } = JSON.parse(response.content)
            if (error) return callback(new Error(error))

        }
        callback()
    })
    // JSON.parse(response.content.error)
    // if(JSON.parse(response.content.error)) return callback(new Error(JSON.parse(response.content.error)))
}