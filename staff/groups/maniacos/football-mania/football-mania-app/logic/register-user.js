function registerUser(name, surname, age, city, username, password, callback) {
    if (typeof name !== 'string') throw new TypeError(`name ${name} is not a string`)
    if (!name.trim()) throw new Error('name is empty')
    if (typeof surname !== 'string') throw new TypeError(`surname ${surname} is not a string`)
    if (!surname.trim()) throw new Error('surname is empty')
    if (typeof age !== "string") throw new TypeError(`age ${age} is not a string`)
    if (!age.trim()) throw new Error (`age is empty`)
    if (typeof city !== 'string') throw new TypeError(`city ${city} is not a string`)
    if (!city.trim()) throw new Error(`city ${city} is empty`)
    if (typeof username !== 'string') throw new TypeError(`username ${username} is not a string`)
    if (!username.trim()) throw new Error('username is empty')
    if (typeof password !== 'string') throw new TypeError(`password ${password} is not a string`)
    if (!password.trim()) throw new Error('password is empty')
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, age, city, username, password })
    }, (error, response) => {
        if (error) return callback(error)

        if (response.status === 201) callback() //registre no retorna body
        else if (response.status === 409) {  //usuari existeix
            const { error } = JSON.parse(response.content)

            callback(new Error(error))
        } else callback(new Error('Unknown error'))
    })
}