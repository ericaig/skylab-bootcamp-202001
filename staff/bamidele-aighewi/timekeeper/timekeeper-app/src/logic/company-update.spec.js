// require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company } } = require('timekeeper-data')
const { expect } = require('chai')
const companyUpdate = require('./company-update')
const { mongoose, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { v4: uuid } = require('uuid')
const { random } = Math
const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('companyUpdate', () => {
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

        it('should succeed on correct and valid and right data', () => {
            const props = { name: `New Name - ${random()}`, cif: 'F3989472J' }
            return companyUpdate(props)
                .then(result => {
                    expect(result).not.to.exist
                    expect(result).to.be.undefined

                    return Company.findOne({ _id: company })
                })
                .then(_company => {
                    expect(_company).to.exist
                    expect(_company.id).to.be.a('string')
                    expect(_company.id).to.equal(company)
                    expect(_company.name).to.equal(props.name)
                    expect(_company.cif).to.equal(props.cif)
                })
        })
    })

    it('should fail on non object props parameter', () => {
        const name = 'props'
        let target

        target = false
        expect(() => companyUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = null
        expect(() => companyUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = undefined
        expect(() => companyUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = 'hello world!'
        expect(() => companyUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)
    })

    afterAll(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})