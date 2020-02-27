const jwt = require('jsonwebtoken')
const atob = require('atob')
const { users } = require('../data')
const { validate } = require('../utils')
const fs = require('fs').promises
const path = require('path')

const { env: { SECRET } } = process

module.exports = (token) => {
    validate.string(token, 'token')

    try {
        jwt.verify(token, SECRET)
        let [, payload] = token.split('.')
        const { sub: userId } = JSON.parse(atob(payload))

        const user = users.find(user => user.id === userId)

        if (!user) throw new Error('Wrong credentials')

        user.retrieved = new Date

        return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4)).then(() => user)
    } catch (error) {
        throw error
    }
}