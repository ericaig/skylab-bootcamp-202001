require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const userRegister = require('./user-register')
const bcrypt = require('bcryptjs')
const { ContentError } = require('timekeeper-errors')

const { env: { TEST_MONGODB_URL } } = process

describe('userRegistration', () => {
    let name, surname, email, password, role

    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        role = CLIENT
    })

    it('should succeed on correct user data', () =>
        userRegister(name, surname, email, password, role)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return User.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.created).to.be.instanceOf(Date)

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    )

    it('should fail on non-string name parameter', () => {
        const name = 'name'
        let target

        target = 1
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string surname parameter', () => {
        const name = 'surname'
        let target

        target = 1
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRegister('Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string email parameter', () => {
        const name = 'email'
        let target

        target = 1
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non valid email parameter', () => {
        let target

        target = "eric@"
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail"
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail."
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail.c"
        expect(() => userRegister('Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)
    })

    it('should fail on non-string password parameter', () => {
        const name = 'password'
        let target

        target = 1
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non integer role parameter', () => {
        const name = 'role'
        let target

        target = false
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', '123', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = null
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', '123', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = undefined
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', '123', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = {}
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', '123', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = []
        expect(() => userRegister('Eric', 'Aig', 'eric@mail.com', '123', target)).to.throw(TypeError, `${name} ${target} is not a number`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})