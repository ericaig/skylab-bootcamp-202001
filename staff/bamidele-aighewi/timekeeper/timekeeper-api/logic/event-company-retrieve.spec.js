require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company, Event, WeekDay } } = require('timekeeper-data')
const { expect } = require('chai')
const unitFunction = require('./event-company-retrieve')
const {
    mongoose,
    utils: {
        roles: { CLIENT },
        eventStates: { ACCEPTED, PENDING },
        eventTypes: { WORK_DAY, WORK_HOLIDAY }
    }
} = require('timekeeper-data')
const { v4: uuid } = require('uuid')
const { random } = Math
const moment = require('moment')

describe('eventCompanyRetrieve', () => {
    let owner, company

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        owner = user.id

        const _company = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'P0080665C', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        company = _company.id

        user.company = company
        await user.save()

        await WeekDay.create({ company, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, createdBy: owner, updatedBy: owner })

        let start = moment().startOf('month').format('YYYY-MM-DD')
        let end = moment().startOf('month').add(3, 'days').format('YYYY-MM-DD')
        await Event.create({ company, start, end, type: WORK_DAY, state: ACCEPTED, description: `Description ${random()}`, createdBy: owner, updatedBy: owner })

        start = moment(end, 'YYYY-MM-DD').add(3, 'days').format('YYYY-MM-DD')
        end = moment(start, 'YYYY-MM-DD').add(3, 'days').format('YYYY-MM-DD')
        await Event.create({ company, start, end, type: WORK_HOLIDAY, state: ACCEPTED, description: `Description ${random()}`, createdBy: owner, updatedBy: owner })
    })

    it('should succeed on retrieving company events', async () => {
        let _event = await Event.findOne({ company, type: WORK_DAY }).lean()
        expect(_event).to.exist
        expect(_event).to.be.an('object')
        expect(_event.user).not.to.exist
        expect(_event._id.toString()).to.be.a('string')
        expect(_event.state).to.equal(ACCEPTED)

        _event = await Event.findOne({ company, type: WORK_HOLIDAY }).lean()
        expect(_event).to.exist
        expect(_event).to.be.an('object')
        expect(_event.user).not.to.exist
        expect(_event._id.toString()).to.be.a('string')
        expect(_event.state).to.equal(ACCEPTED)
    })

    it('should fail on non-string user parameter', () => {
        const name = 'user'
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

    it('should fail on invalid date start parameter', () => {
        let target

        target = "a string"
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = false
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = null
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = undefined
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = {}
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = []
        expect(() => unitFunction('a8s7dfa', target)).to.throw(TypeError, `${target} is not a valid date`)
    })

    it('should fail on invalid date end parameter', () => {
        let target

        target = "a string"
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = false
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = null
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = undefined
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = {}
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)

        target = []
        expect(() => unitFunction('a8s7dfa', '2020-03-31', target)).to.throw(TypeError, `${target} is not a valid date`)
    })

    it('should fail on non integer type parameter', () => {
        const name = 'type'
        let target

        target = false
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = null
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = (() => { })
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = {}
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = []
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a number`)
    })

    it('should fail on non integer state parameter', () => {
        const name = 'state'
        let target

        target = false
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = null
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = (() => { })
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = {}
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = []
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', WORK_DAY, target)).to.throw(TypeError, `${name} ${target} is not a number`)
    })

    after(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})