// require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company } } = require('timekeeper-data')
const { expect } = require('chai')
const { random } = Math
const userRetrieve = require('./retrieve-user')
const { mongoose, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { v4: uuid } = require('uuid')
// const { NotAllowedError } = require('timekeeper-errors')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('userRetrieve', () => {    
    let owner,
    name = `name-${random()}`,
    surname = `surname-${random()}`,
    email = `email-${random()}@mail.com`,
    password = `password-${random()}`,
    role = CLIENT

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Company.deleteMany()
        await User.deleteMany()

        const user = await User.create({ name, surname, email, password, role, created: new Date })
        owner = user.id

        context.token = jwt.sign({ sub: owner }, TEST_JWT_SECRET)

        const _company = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'P0080665C', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        const company = _company.id

        user.company = company
        return user.save().then(_user => owner = _user.id)
    })

    it('should succeed on correct and valid and right data', () =>
        userRetrieve()
            .then(user => {
                expect(user.constructor).to.equal(Object)
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.role).to.equal(role)
                expect(user.password).to.be.undefined
            })
    )

    it('should fail on non integer user parameter', () => {
        const name = 'id'
        let target

        target = false
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => userRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    afterAll(async () => {
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})