const { registerUser } = require('../logic')
const { expect } = require('chai')
const { users } = require('../data')
const fs = require('fs').promises
const path = require('path')
const { v4: uuid } = require('uuid')

describe('registerUser', () => {
    let name, surname, email, password, id

    beforeEach(() => {
        id = uuid()
        name = 'Name - ' + Math.random()
        surname = 'Surname - ' + Math.random()
        email = 'email-' + Math.random() + '@mail.com'
        password = 'password' + Math.random()
    })

    describe('when user does not exist', () => {
        beforeEach(() => {
            return registerUser(name, surname, email, password).then(response => {
                expect(response).to.be.undefined
            })
        })

        it('should successfully recover newly created user', () => {
            const user = users.find(item => item.email === email)
            expect(user).to.be.an('object')
            expect(user.name).to.be.a('string')
            expect(user.surname).to.be.a('string')
            expect(user.email).to.be.a('string')
            expect(user.password).to.be.a('string')

            expect(user.name).to.equal(name)
            expect(user.surname).to.equal(surname)
            expect(user.email).to.equal(email)
            expect(user.password).to.equal(password)
        })
    })

    describe('when user exists', () => {
        beforeEach(() => {
            users.push({ id, name, surname, email, password })
            return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
        })

        it('should fail if user already exists', () => {
            const user = users.find(item => item.email === email)
            expect(user).to.be.an('object')

            expect(() => {
                return registerUser(name, surname, email, password).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(Error, `user with email ${email} already exists`)
        })
    })

    afterEach(() => {
        const index = users.findIndex(item => item.email === email)
        users.splice(index, 1)
        return fs.writeFile(path.join(__dirname, '../data/users.json'), JSON.stringify(users, null, 4))
    })

    it('should fail on non-string name parametre', () => {
        const _name = 'name'
        let target

        target = 1
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty name parametre', () => {
        const _name = 'name'
        let target

        target = ''
        expect(() => registerUser(target)).to.throw(Error, `${_name} is empty`)

        target = ' '
        expect(() => registerUser(target)).to.throw(Error, `${_name} is empty`)
    })

    it('should fail on non-string surname parametre', () => {
        const _name = 'surname'
        let target

        target = 1
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser(name, target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty surname parametre', () => {
        const _name = 'surname'
        let target

        target = ''
        expect(() => registerUser(name, target)).to.throw(Error, `${_name} is empty`)

        target = ' '
        expect(() => registerUser(name, target)).to.throw(Error, `${_name} is empty`)
    })

    it('should fail on non-string email parametre', () => {
        const _name = 'email'
        let target

        target = 1
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser(name, surname, target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty email parametre', () => {
        const _name = 'email'
        let target

        target = ''
        expect(() => registerUser(name, surname, target)).to.throw(Error, `${_name} is empty`)

        target = ' '
        expect(() => registerUser(name, surname, target)).to.throw(Error, `${_name} is empty`)
    })

    it('should fail on invalid email parametre', () => {
        let target

        target = 'local-part'
        expect(() => registerUser(name, surname, target)).to.throw(Error, `${target} is not an e-mail`)

        target = 'local-part@'
        expect(() => registerUser(name, surname, target)).to.throw(Error, `${target} is not an e-mail`)

        target = 'local-part@domain'
        expect(() => registerUser(name, surname, target)).to.throw(Error, `${target} is not an e-mail`)
    })

    it('should fail on non-string password parametre', () => {
        const _name = 'password'
        let target

        target = 1
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser(name, surname, email, target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty password parametre', () => {
        const _name = 'password'
        let target

        target = ''
        expect(() => registerUser(name, surname, email, target)).to.throw(Error, `${_name} is empty`)

        target = ' '
        expect(() => registerUser(name, surname, email, target)).to.throw(Error, `${_name} is empty`)
    })
})