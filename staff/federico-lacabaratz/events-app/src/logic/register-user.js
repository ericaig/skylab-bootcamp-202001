export default (name, surname, email, password) => {
    if (typeof name !== 'string') throw new TypeError(`name ${name} is not a string`)
    if (!name.trim()) throw new Error('name is empty')
    if (typeof surname !== 'string') throw new TypeError(`surname ${surname} is not a string`)
    if (!surname.trim()) throw new Error('surname is empty')
    if (typeof email !== 'string') throw new TypeError(`email ${email} is not a string`)
    if (!email.trim()) throw new Error('email is empty')
    if (typeof password !== 'string') throw new TypeError(`password ${password} is not a string`)
    if (!password.trim()) throw new Error('password is empty')

    return fetch(`http://localhost:8089/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, surname, email, password })
    })
        .then(response => {
            if (response.status === 201) return
            else if (response.status === 409) {
                const { error } = JSON.parse(response.content)

                throw new Error(error)
            } else throw new Error('Unknown error')
        })
}