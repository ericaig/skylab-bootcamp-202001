require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company, Event, WeekDay } } = require('timekeeper-data')
const { expect } = require('chai')
const unitFunction = require('./event-update')
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

describe('eventUpdate', () => {
    let owner, company, eventId
    let start = moment().startOf('month').format('YYYY-MM-DD')
    let end = moment().startOf('month').add(3, 'days').format('YYYY-MM-DD')

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

        const _event = await Event.create({ company, user: owner, start, end, type: WORK_DAY, state: ACCEPTED, description: `Description ${random()}`, createdBy: owner, updatedBy: owner })
        eventId = _event.id
    })

    describe('when event already exist, update it', () => {
        beforeEach(() => unitFunction(owner, eventId, { state: PENDING, start, end }))

        it('should successfully retrieve update event field', async () => {
            const _event = await Event.findOne({ company, _id: eventId }).lean()
            expect(_event).to.exist
            expect(_event).to.be.an('object')
            expect(_event._id.toString()).to.equal(eventId)
            expect(_event.type).to.equal(WORK_DAY)
            expect(_event.user.toString()).to.equal(owner)
        })
    })


    it('should fail on non-string user parameter', () => {
        const name = 'userId'
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

    it('should fail on non-string eventId parameter', () => {
        const name = 'eventId'
        let target

        target = 1
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => unitFunction('9a8s7df8af7', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non object props parameter', () => {
        const name = 'props'
        let target

        target = false
        expect(() => unitFunction('9a8s7df8af7', 'a8s79dfa89f7', target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = null
        expect(() => unitFunction('9a8s7df8af7', 'a8s79dfa89f7', target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = undefined
        expect(() => unitFunction('9a8s7df8af7', 'a8s79dfa89f7', target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = 'hello world!'
        expect(() => unitFunction('9a8s7df8af7', 'a8s79dfa89f7', target)).to.throw(TypeError, `${name} ${target} is not a Object`)
    })

    after(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})