const { expect } = require('chai')
// const {validate} = require('./utils')
const { users } = require('../data')
const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const { authenticateUser } = require('../logic')
const jwt = require('jsonwebtoken')

describe('authenticateUser', () => {
    let name, surname, email, password, id

    beforeEach(() => {
        name = 'Name - ' + Math.random()
        surname = 'Surname - ' + Math.random()
        email = 'email-' + Math.random() + '@mail.com'
        password = '123'
        id = uuid()
    })

    describe('when user already exists', () => {
        const user = { id, name, surname, email, password, created: new Date }
        users.push(user)

        debugger

        return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4)).then(() => {
            it('should correctly validate user', () => {
                authenticateUser(email, password).then(token => {
                    expect(token).to.be.a('string')
                    expect(jwt.verify(token)).to.not.throw()
                })
            })

            return user
        })

    })

    afterEach(() => {
        const _users = users.map(user => !(user.email === email && user.password === password))

        fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(_users, null, 4))
    })

})