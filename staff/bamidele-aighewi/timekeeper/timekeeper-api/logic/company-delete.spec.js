require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Company }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const unitFunction = require('./company-delete')
const { v4: uuid } = require('uuid')

const { env: { TEST_MONGODB_URL } } = process

describe('companyDelete', () => {
    let companyObj = {}, clientObj = {}

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Company.deleteOne()

        clientObj.name = `name-${random()}`
        clientObj.surname = `surname-${random()}`
        clientObj.email = `email-${random()}@mail.com`
        clientObj.password = `password-${random()}`
        clientObj.role = CLIENT

        const user = await User.create(clientObj)

        clientObj.id = user.id

        companyObj.name = `name-${random()}`
        companyObj.email = `email-${random()}@mail.com`
        companyObj.address = `address-${random()}`
        companyObj.web = `http://web-${random()}.com`
        companyObj.cif = 'Q2402674B'
        companyObj.city = `Barcelona-${random()}`
        companyObj.postalCode = '08560'
        companyObj.startTime = '08:00'
        companyObj.endTime = '17:00'
        companyObj.invite = uuid()
        companyObj.owner = user.id

        const company = await Company.create(companyObj)
        user.company = company.id
        await user.save()
    })

    // beforeEach(() => {})

    // it('should succeed in deleting company', async () => {
    describe('deleting a company', () => {
        beforeEach(async () => {
            await unitFunction(clientObj.id)
        })

        it('should not retrieve deleted company', async () => {
            const company = await Company.findOne({ email: companyObj.email, owner: clientObj.id }).lean()
            expect(company).not.to.exist
            expect(company).to.be.null
        })
    })


    it('should fail on non-string owner parameter', () => {
        const name = 'owner'
        let target

        target = 1
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => unitFunction(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})