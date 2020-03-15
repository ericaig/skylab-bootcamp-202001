require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User } } = require('timekeeper-data')
const { expect } = require('chai')
const { random } = Math
const userRetrieve = require('./user-retrieve')
const { mongoose, utils: { roles: { CLIENT } } } = require('timekeeper-data')
// const { NotAllowedError } = require('timekeeper-errors')

describe('userRetrieve', () => {
    before(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => User.deleteMany())
    )

    let name, surname, email, password, role, users

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
            User.create({ name, surname, email, password, role, created: new Date })
                .then(({ id }) => _id = id)
        )

        it('should succeed on correct and valid and right data', () =>
            userRetrieve(_id)
                .then(user => {
                    expect(user.constructor).to.equal(Object)
                    expect(user.name).to.equal(name)
                    expect(user.surname).to.equal(surname)
                    expect(user.email).to.equal(email)
                    expect(user.role).to.equal(role)
                    expect(user.password).to.be.undefined
                })
        )
    })

    it('should fail on non integer id parameter', () => {
        const name = 'id'
        let target

        target = false
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(() => User.deleteMany().then(() => mongoose.disconnect()))
})