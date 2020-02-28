const { expect } = require('chai')
const { users } = require('../data')
const fs = require('fs').promises
const path = require('path')
const { v4: uuid } = require('uuid')

const { authenticateUser } = require('../logic')
// const jwt = require('jsonwebtoken')
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
        const name = 'email'
        let target
        
        target = 1
        expect(() => authenticateUser(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => authenticateUser(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => authenticateUser(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => authenticateUser(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on empty email', () => {
        const name = 'email'
        let target

        target = ''
        expect(() => authenticateUser(target)).to.throw(Error, `${name} is empty`)

        target = ' '
        expect(() => authenticateUser(target)).to.throw(Error, `${name} is empty`)
    })

    it('should fail on invalid email address', () => {
        let target

        target = '@mail.com'
        expect(() => authenticateUser(target)).to.throw(Error, `${target} is not an e-mail`)

        target = 'asdfaf#@#®#rsfasdfasdf@mail.com'
        expect(() => authenticateUser(target)).to.throw(Error, `${target} is not an e-mail`)
    })

})