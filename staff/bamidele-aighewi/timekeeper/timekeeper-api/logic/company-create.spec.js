require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Company }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const companyCreate = require('./company-create')
const { ContentError } = require('timekeeper-errors')

const { env: { TEST_MONGODB_URL } } = process

describe('companyCreate', () => {
    let name, email, address, owner, web, cif, city, postalCode, startTime, endTime

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
        await Company.deleteOne()

        const user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        owner = user.id
    })

    beforeEach(() => {
        name = `name-${random()}`
        email = `email-${random()}@mail.com`
        address = `address-${random()}`
        password = `password-${random()}`
        web = `http://web-${random()}.com`
        cif = 'C68297126'
        city = `Barcelona-${random()}`
        postalCode = '08560'
        startTime = '08:00'
        endTime = '17:00'
        role = CLIENT
    })

    it('should succeed on correct user data', () =>
        companyCreate(name, email, address, owner, web, cif, city, postalCode, startTime, endTime)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return Company.findOne({ owner, cif })
            })
            .then(company => {
                expect(company).to.exist
                expect(company.id).to.be.a('string')
                expect(company.invite).to.be.a('string')
                expect(company.name).to.equal(name)
                expect(company.email).to.equal(email)
                expect(company.address).to.equal(address)
                expect(company.owner.toString()).to.equal(owner)
                expect(company.web).to.equal(web)
                expect(company.cif).to.equal(cif)
                expect(company.city).to.equal(city)
                expect(company.postalCode).to.equal(postalCode)
                expect(company.startTime).to.equal(startTime)
                expect(company.endTime).to.equal(endTime)
                expect(company.createdAt).to.be.instanceOf(Date)
            })
    )

    it('should fail on non-string name parameter', () => {
        const name = 'name'
        let target

        target = 1
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non valid email parameter', () => {
        let target

        target = "eric@"
        expect(() => companyCreate('Eric', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail"
        expect(() => companyCreate('Eric', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail."
        expect(() => companyCreate('Eric', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail.c"
        expect(() => companyCreate('Eric', target)).to.throw(ContentError, `${target} is not an e-mail`)
    })

    it('should fail on non-string address parameter', () => {
        const name = 'address'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string owner parameter', () => {
        const name = 'owner'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non valid url web parameter', () => {
        let target

        target = "http://"
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', target)).to.throw(ContentError, `${target} is not a valid url`)

        target = "http://example"
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', target)).to.throw(ContentError, `${target} is not a valid url`)

        target = "http://example."
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', target)).to.throw(ContentError, `${target} is not a valid url`)

        target = "http://example.c"
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', target)).to.throw(ContentError, `${target} is not a valid url`)
    })

    it('should fail on non valid CIF parameter', () => {
        let target

        target = "S6093770D" //...C
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', target)).to.throw(ContentError, `${target} is not a valid CIF`)

        target = "Q9696025H" //...G
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', target)).to.throw(ContentError, `${target} is not a valid CIF`)

        target = "G89847108" //...7
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', target)).to.throw(ContentError, `${target} is not a valid CIF`)

        target = "D36836438" //...5
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', target)).to.throw(ContentError, `${target} is not a valid CIF`)
    })

    it('should fail on non-string city parameter', () => {
        const name = 'city'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string postalCode parameter', () => {
        const name = 'postalCode'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string startTime parameter', () => {
        const name = 'startTime'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })
    
    it('should fail on non-string endTime parameter', () => {
        const name = 'endTime'
        let target

        target = 1
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => companyCreate('Eric', 'eric@mail.com', 'My address', 'owneridstring', 'http://example.com', 'G89847107', 'Barcelona', '08560', '08:00', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})