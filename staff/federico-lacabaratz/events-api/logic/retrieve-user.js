const { validate } = require('../utils')
const { users } = require('../data')
const atob = require('atob')

const fs = require('fs').promises
const path = require('path')
const jwt = require('jsonwebtoken')

const { env: { SECRET } } = process

module.exports = (token) => {
    validate.string(token, 'token')

    try {
        jwt.verify(token, SECRET)

        const [, payload] = token.split('.')
        const { sub } = JSON.parse(atob(payload))

        if (!sub) throw new Error('no user id in token')

        const user = users.find(user => user.id === sub)

        const {name, surname, email} = user

        user.retrieved = new Date

        return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
            .then(() => {return {name, surname, email}})
    } catch (error) {
        throw error
    }
}