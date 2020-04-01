require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company } } = require('timekeeper-data')
// const { expect } = require('chai')
const companyRetrieve = require('./company-retrieve')
const { mongoose, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { v4: uuid } = require('uuid')
const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('companyRetrieve', () => {
    let owner, company

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Company.deleteOne()

        const user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        owner = user.id

        context.token = jwt.sign({ sub: owner }, TEST_JWT_SECRET)
    })

    describe('when user already exists', () => {
        beforeEach(() =>
            Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'P0080665C', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
                .then(({ id }) =>
                    company = id
                )
                .then(id =>
                    User.findOneAndUpdate({ _id: owner }, { company: id })
                )
        )

        it('should succeed on correct and valid and right data', () =>
            companyRetrieve(owner)
                .then(_company => {
                    // expect(_company).to.exist
                    expect(typeof _company.id.toString()).toBe('string')
                    expect(_company.id.toString()).toBe(company)
                    expect(typeof _company.owner.id.toString()).toBe('string')
                    expect(_company.owner.id.toString()).toBe(owner)
                    expect(typeof _company.invite).toBe('string')
                })
        )
    })

    // it('should fail on non integer id parameter', () => {
    //     const name = 'owner'
    //     let target

    //     target = false
    //     expect(() => companyRetrieve(target)).toThrow(TypeError, `${name} ${target} is not a string`)

    //     target = null
    //     expect(() => companyRetrieve(target)).toThrow(TypeError, `${name} ${target} is not a string`)

    //     target = undefined
    //     expect(() => companyRetrieve(target)).toThrow(TypeError, `${name} ${target} is not a string`)

    //     target = {}
    //     expect(() => companyRetrieve(target)).toThrow(TypeError, `${name} ${target} is not a string`)

    //     target = []
    //     expect(() => companyRetrieve(target)).toThrow(TypeError, `${name} ${target} is not a string`)
    // })

    afterAll(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})