const { expect } = require('chai')
// require('mocha')
// const {validate} = require('./utils')
const { users } = require('../data')
const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const { authenticateUser } = require('../logic')
const jwt = require('jsonwebtoken')
const { NotAllowedError } = require('../errors')

describe('authenticateUser', () => {
    let name, surname, email, password, id

    beforeEach(() => {
        name = 'Name - ' + Math.random()
        surname = 'Surname - ' + Math.random()
        email = 'email-' + Math.random() + '@mail.com'
        password = '123'
        id = uuid()
    });

    describe('when user already exists', () => {
        beforeEach(() => {
            const user = { id, name, surname, email, password, created: new Date }
            users.push(user)

            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4)).then(() => user)
        })

        it('should correctly validate user', () => {
            return authenticateUser(email, password).then(userId => {
                expect(userId).to.be.a('string')

                id = userId

                return id
            })
        })

        it('should should fail on incorrect email', () => {
            expect(() => {
                return authenticateUser(`${email}`, `${password}-wrong`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotAllowedError)
        })

        it('should should fail on incorrect password', () => {
            expect(() => {
                return authenticateUser(`wrong-${email}`, `${password}`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotAllowedError)
        })


        afterEach(() => {
            const index = users.findIndex(user => user.email === email && user.password === password)
            users.splice(index, 1)

            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })
    })

    it('should fail on non-string email', () => {
        expect(() => authenticateUser(1)).to.throw(TypeError, '')
    })

})