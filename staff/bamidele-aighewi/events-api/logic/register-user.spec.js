require('dotenv').config()

const { expect } = require('chai')
const { ObjectId } = require('mongodb')
const { random } = Math
const { database } = require('../data')
const { registerUser } = require('../logic')
const { ContentError } = require('../errors')

const { env: { MONGODB_URL } } = process

describe('registerUser', () => {
    let name, surname, email, password, users

    before(() =>
        database.connect(MONGODB_URL)
            .then(() => users = database.collection('users'))
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', () =>
        registerUser(name, surname, email, password)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return users.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user._id).to.be.instanceOf(ObjectId)
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password) // TODO encrypt this field!
                expect(user.created).to.be.instanceOf(Date)
            })
    )

    afterEach(() => users.deleteOne({ email }))

    it('should fail on non-string name', () => {
        const _name = 'name'
        let target

        target = 1
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser(target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty name', () => {
        const _name = 'name'
        let target

        target = ''
        expect(() => registerUser(target)).to.throw(ContentError, `${_name} is empty`)

        target = ' '
        expect(() => registerUser(target)).to.throw(ContentError, `${_name} is empty`)
    })

    it('should fail on non-string surname', () => {
        const _name = 'surname'
        let target

        target = 1
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser('Pepito', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty surname', () => {
        const _name = 'surname'
        let target

        target = ''
        expect(() => registerUser('Pepito', target)).to.throw(ContentError, `${_name} is empty`)

        target = ' '
        expect(() => registerUser('Pepito', target)).to.throw(ContentError, `${_name} is empty`)
    })

    it('should fail on non-string email', () => {
        const _name = 'email'
        let target

        target = 1
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = false
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = null
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = undefined
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = {}
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)

        target = []
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('should fail on empty email', () => {
        const _name = 'email'
        let target

        target = ''
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${_name} is empty`)

        target = ' '
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${_name} is empty`)
    })

    it('should fail on invalid email', () => {
        let target

        target = 'local'
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = 'local@'
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = 'local@domain'
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = 'local@domain.'
        expect(() => registerUser('Pepito', 'Grillo', target)).to.throw(ContentError, `${target} is not an e-mail`)
    })


    // TODO unhappy paths and other happies if exist

    after(() => database.disconnect())

})