require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Company }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const unitFunction = require('./client-company-create')
const { ContentError } = require('timekeeper-errors')

const { env: { TEST_MONGODB_URL } } = process

describe('clientunitFunction', () => {
    let companyObj = {}, clientObj = {}

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Company.deleteOne()

        clientObj.name = `name-${random()}`
        clientObj.surname = `surname-${random()}`
        clientObj.email = `email-${random()}@mail.com`
        clientObj.password = `password-${random()}`

        companyObj.name = `name-${random()}`
        companyObj.email = `email-${random()}@mail.com`
        companyObj.address = `address-${random()}`
        companyObj.web = `http://web-${random()}.com`
        companyObj.cif = 'Q2402674B'
        companyObj.city = `Barcelona-${random()}`
        companyObj.postalCode = '08560'
        companyObj.startTime = '08:00'
        companyObj.endTime = '17:00'

        return unitFunction(clientObj, companyObj)
    })

    // beforeEach(() => {})

    it('should succeed successfully retrieve client and company details', async () => {
        const user = await User.findOne({ email: clientObj.email }).lean()
        expect(user).to.exist
        expect(user._id.toString()).to.be.a('string')
        expect(user.name).to.equal(clientObj.name)
        expect(user.surname).to.equal(clientObj.surname)
        expect(user.email).to.equal(clientObj.email)
        expect(user.role).to.equal(CLIENT)

        const company = await Company.findOne({ email: companyObj.email, owner: user._id }).lean()
        expect(company).to.exist
        expect(company._id.toString()).to.be.a('string')
        expect(company.owner.toString()).to.equal(user._id.toString())
        expect(company.name).to.equal(companyObj.name)
        expect(company.email).to.equal(companyObj.email)
        expect(company.address).to.equal(companyObj.address)
        expect(company.web).to.equal(companyObj.web)
        expect(company.cif).to.equal(companyObj.cif)
        expect(company.city).to.equal(companyObj.city)
        expect(company.postalCode).to.equal(companyObj.postalCode)
        expect(company.startTime).to.equal(companyObj.startTime)
        expect(company.endTime).to.equal(companyObj.endTime)
    })


    it('should fail on non-object client parameter', () => {
        const name = 'ClientObj'
        let target

        target = 1
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = false
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = null
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = undefined
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a Object`)
    })

    it('should fail on non-object company parameter', () => {
        const name = 'CompanyObj'
        let target

        target = 1
        expect(() => unitFunction({}, target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = false
        expect(() => unitFunction({}, target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = null
        expect(() => unitFunction({}, target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = undefined
        expect(() => unitFunction({}, target)).to.throw(TypeError, `${name} ${target} is not a Object`)
    })

    after(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})