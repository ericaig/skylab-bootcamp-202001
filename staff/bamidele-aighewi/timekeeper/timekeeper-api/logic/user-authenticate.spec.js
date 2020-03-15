require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { mongoose, models: { User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { expect } = require('chai')
const { random } = Math
const userAuthenticate = require('./user-authenticate')
const bcrypt = require('bcryptjs')
const { ContentError, NotAllowedError } = require('timekeeper-errors')

describe('authenticateUser', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, email, password, role

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
        role = CLIENT
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            bcrypt.hash(password, 10)
                .then(password =>
                    User.create({ name, surname, email, password, role })
                )
                .then(user => _id = user.id)
        )

        it('should succeed on correct and valid and right credentials', () =>
            userAuthenticate(email, password)
                .then(id => {
                    expect(id).to.be.a('string')
                    expect(id.length).to.be.greaterThan(0)
                    expect(id).to.equal(_id)
                })
        )
    })

    describe('when user does not exists', () => {
        it('should fail on incorrect credentials', () =>
            userAuthenticate(`wrong-${email}`, `${password}-wrong`)
                .then(() => {
                    throw new Error('Should not reach this point')
                }).catch(error => {
                    expect(error).to.be.instanceOf(NotAllowedError)
                    expect(error.message).to.equal('wrong credentials')
                })
        )
    })

    it('should fail on non-string email parameter', () => {
        const name = 'email'
        let target

        target = 1
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userAuthenticate(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non valid email parameter', () => {
        let target

        target = "eric@"
        expect(() => userAuthenticate(target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail"
        expect(() => userAuthenticate(target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail."
        expect(() => userAuthenticate(target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail.c"
        expect(() => userAuthenticate(target)).to.throw(ContentError, `${target} is not an e-mail`)
    })

    it('should fail on non-string password parameter', () => {
        const name = 'password'
        let target

        target = 1
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userAuthenticate('eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})