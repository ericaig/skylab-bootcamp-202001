const { v4: uuid } = require('uuid')
const { users } = require('../data')
const { retrieveUser } = require('../logic')
const { expect } = require('chai')
const fs = require('fs').promises
const path = require('path')
const { NotFoundError, NotAllowedError } = require('../errors')

describe('retrieveUser', () => {
    let name, surname, email, password, id

    beforeEach(() => {
        name = 'Name - ' + Math.random()
        surname = 'Surname - ' + Math.random()
        email = 'email-' + Math.random() + '@mail.com'
        password = 'password-' + Math.random()
        id = uuid()
    })

    describe('when user already exists', () => {
        beforeEach(() => {
            users.push({ id, name, surname, email, password })
            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })

        it('should successfully retrieve existing user', () => {
            return retrieveUser(id).then(user => {
                expect(user).to.be.an('object')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
            })
        })

        it('should fail on retrieving a non existing user', () => {
            expect(() => {
                return retrieveUser(`${id}-wrong`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotFoundError, `user with id ${id}-wrong does not exist`)
        })
    })

    describe('when user is deactivated', () => {
        beforeEach(() => {
            users.push({ id, name, surname, email, password, deactivated: true })
            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })

        it('should fail on retrieving a deactivated user', () => {
            expect(() => {
                return retrieveUser(id).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(NotAllowedError, `user with id ${id} is deactivated`)
        })
    })

    afterEach(() => {
        const index = users.findIndex(item => item.id === id)
        users.splice(index, 1)
        return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
    })

    it('should fail on non string id param', ()=>{
        const _name = 'id'
        let target

        target = 1
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => retrieveUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty id parametre', () => {
        const _name = 'id'
        let target

        target = ''
        expect(() => retrieveUser(target)).to.throw(Error, `${_name} is empty`)

        target = ' '
        expect(() => retrieveUser(target)).to.throw(Error, `${_name} is empty`)
    })
})