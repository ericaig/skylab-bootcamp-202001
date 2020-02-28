const { validate } = require('../utils')
const { users } = require('../data')

const fs = require('fs').promises
const path = require('path')
const { NotAllowedError, EmptyValueError } = require('../errors')

module.exports = (email, password) => {
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    const user = users.find(user => user.email === email && user.password === password)

    if (!user) throw new NotAllowedError(`Wrong credentials`)

    if(!user.email) throw new EmptyValueError(`User email is empty`)
    
    if(!user.password) throw new EmptyValueError(`User password is empty`)

    user.authenticated = new Date

    return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        .then(() => user.id)
}