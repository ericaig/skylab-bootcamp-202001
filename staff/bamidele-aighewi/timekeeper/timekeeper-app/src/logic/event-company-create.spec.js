// require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const {
    mongoose,
    models: { User, Company, WeekDay, Event },
    utils: {
        roles: { CLIENT },
        eventTypes: { WORK_DAY },
        eventStates: { PENDING }
    }
} = require('timekeeper-data')
const eventCompanyCreate = require('./event-company-create')
const { v4: uuid } = require('uuid')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('eventCompanyCreate', () => {
    let user, company
    let start, end, type, description, state

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const _user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        const { id: userId } = _user
        user = userId

        context.token = jwt.sign({ sub: user }, TEST_JWT_SECRET)

        const { id: _company } = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner: user, web: 'http://company.url', cif: 'Company-cif', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        company = _company
        _user.company = _company
        await _user.save()

        await WeekDay.create({ company, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, createdBy: user, updatedBy: user })
    })

    beforeEach(() => {
        start = "2020-01-01"
        end = "2020-01-10"
        type = WORK_DAY
        description = `description - ${random()}`
        state = PENDING
    })

    it('should succeed on creating a new event', () =>
        eventCompanyCreate(start, end, type, description)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return Event.findOne({ company, type, start, end })
            })
            .then(_event => {
                expect(_event).to.exist
                expect(_event.id).to.be.a('string')
                expect(_event.company.toString()).to.equal(company)
                expect(_event.user).not.to.exist
                expect(_event.type).to.equal(type)
                expect(_event.start.toString()).to.equal(new Date(start).toString())
                expect(_event.end.toString()).to.equal(new Date(end).toString())
                // expect(_event.state).to.equal(state)
                expect(_event.description).to.equal(description)
            })
    )

    it('should fail on invalid date start parameter', () => {
        let target

        // target = 1 -> because I'm using moment to check if a date is correct, passing 1 to moment(1) gives a valid date :O
        // expect(() => eventCompanyCreate('user-id-string', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = false
        expect(() => eventCompanyCreate(target)).to.throw(TypeError, `${target} is not a valid date`)

        target = null
        expect(() => eventCompanyCreate(target)).to.throw(TypeError, `${target} is not a valid date`)

        target = undefined
        expect(() => eventCompanyCreate(target)).to.throw(TypeError, `${target} is not a valid date`)

        target = {}
        expect(() => eventCompanyCreate(target)).to.throw(TypeError, `${target} is not a valid date`)

        target = []
        expect(() => eventCompanyCreate(target)).to.throw(TypeError, `${target} is not a valid date`)
    })

    it('should fail on invalid date end parameter', () => {
        let target

        // target = 1 -> because I'm using moment to check if a date is correct, passing 1 to moment(1) gives a valid date :O
        // expect(() =>
        //     eventCompanyCreate('user-id-string', '2020-01-01', target)
        // ).to.throw(TypeError, `${target} is not a valid date`)

        target = false
        expect(() => eventCompanyCreate('2020-01-01', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = null
        expect(() => eventCompanyCreate('2020-01-01', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = undefined
        expect(() => eventCompanyCreate('2020-01-01', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = {}
        expect(() => eventCompanyCreate('2020-01-01', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = []
        expect(() => eventCompanyCreate('2020-01-01', target)).to.throw(TypeError, `${target} is not a valid date`)
    })

    it('should fail on non integer type parameter', () => {
        const name = 'type'
        let target

        target = false
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = null
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = undefined
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = {}
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = []
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', target)).to.throw(TypeError, `${name} ${target} is not a number`)
    })

    it('should fail on non-string description parameter', () => {
        const name = 'description'
        let target

        target = 1
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => eventCompanyCreate('2020-01-01', '2020-01-10', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    afterAll(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})