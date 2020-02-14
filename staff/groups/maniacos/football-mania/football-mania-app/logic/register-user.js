/**
 * @param {string} name - The user's name
 * @param {string} surname - The user's surname
 * @param {string} age - The user's age
 * @param {string} city - The user's city
 * @param {string} username - The user's username
 * @param {string} password - The user's password
 * @param {function} callback - Callback to execute after registration. It returns error, undefined or nothing if registration was successful
 * @throws Will throw an error if an argument doesn't match it's type
 */

function registerUser(name, surname, age, city, username, password, callback) {
    if (typeof name !== 'string') throw new TypeError(`${name} is not a string`)
    if (!name.trim()) throw new Error('name is empty')
    if (typeof surname !== 'string') throw new TypeError(`${surname} is not a string`)
    if (!surname.trim()) throw new Error('surname is empty')
    if (typeof age !== "string") throw new TypeError(`${age} is not a string`)
    if (!age.trim()) throw new Error (`age is empty`)
    if (typeof city !== 'string') throw new TypeError(`${city} is not a string`)
    if (!city.trim()) throw new Error(`${city} is empty`)
    if (typeof username !== 'string') throw new TypeError(`${username} is not a string`)
    if (!username.trim()) throw new Error('username is empty')
    if (typeof password !== 'string') throw new TypeError(`${password} is not a string`)
    if (!password.trim()) throw new Error('password is empty')
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, age, city, username, password, flag: 'football-mania-app' })
    }, (error, response) => {
        if (error) return callback(error)

        if (response.status === 201) callback() //registre no retorna body
        else if (response.status === 409) {  //usuari existeix
            const { error } = JSON.parse(response.content)

            callback(new Error(error))
        } else callback(new Error('Unknown error'))
    })
}