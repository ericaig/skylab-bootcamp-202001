const { authenticateUser } = require('.')
const { expect } = require('chai')
const { users } = require('../data')
const fs = require('fs').promises
const path = require('path')
const uuid = require('uuid/v4')
const { NotAllowedError } = require('../errors')

describe('authenticate', () => {
    let user

    beforeEach(() => {

        user = {
            id: uuid(),
            name: `name-${Math.random()}`,
            surname: `surname-${Math.random()}`,
            email: `email-${Math.random()}@email.com`,
            password: `password-${Math.random()}`,
        }
    })

    describe('when user already exists', () => {
        beforeEach(() => {
            users.push(user);

            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })


        it('should succeed on correct credentials', () =>
            authenticateUser(user.email, user.password)
                .then(id => {
                    expect(user.id).to.be.a('string')
                    expect(user.id).to.have.lengthOf.above(0)
                })
        )

        it('should should fail on incorrect email', () => {
            expect(() => {
                return authenticateUser(`${user.email}wrong`, `${user.password}`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotAllowedError)
        })

        it('should should fail on incorrect password', () => {
            expect(() => {
                return authenticateUser(`${user.email}`, `${user.password}-wrong`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotAllowedError)
        })

        afterEach(() => {
            const index = users.findIndex(user => user === user)
            users.splice(index, 1)

            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })
    })

    it('should fail on non-string email', () => {
        expect(() => authenticateUser(1)).to.throw(TypeError, '')
    })
})