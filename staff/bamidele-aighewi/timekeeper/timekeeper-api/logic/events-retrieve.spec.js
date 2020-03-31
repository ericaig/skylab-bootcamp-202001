require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company, Event, WeekDay } } = require('timekeeper-data')
const { expect } = require('chai')
const unitFunction = require('./events-retrieve')
const {
    mongoose,
    utils: {
        roles: { CLIENT, WORKER },
        eventStates: { ACCEPTED, PENDING },
        eventTypes: { WORK_DAY, WORK_HOLIDAY, USER_HOLIDAY, USER_ABSENCE, USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { v4: uuid } = require('uuid')
const { random } = Math
const moment = require('moment')

describe('eventsRetrieve', () => {
    let owner, company
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

        const createUser = async (role, _company) => {
            let clientObj = {}
            clientObj.name = `name-${random()}`
            clientObj.surname = `surname-${random()}`
            clientObj.email = `email-${random()}@mail.com`
            clientObj.password = `password-${random()}`
            clientObj.role = role

            if (typeof _company !== 'undefined') clientObj.company = _company

            return User.create(clientObj)
        }


        let promises = Promise.resolve()

        for (let x = 0; x < 20; x++) {
            let _user
            promises = promises
                .then(() => createUser(WORKER, company))
                .then(__user => _user = __user)
                .then(() => Event.create({ company, user: _user.id, start: Date.now(), end: Date.now(), type: USER_HOLIDAY, state: PENDING, description: 'Event 3', createdBy: _user.id, updatedBy: _user.id }))
                .then(() => Event.create({ company, user: _user.id, start: Date.now(), end: Date.now(), type: USER_ABSENCE, state: PENDING, description: 'Event 4', createdBy: _user.id, updatedBy: _user.id }))
                .then(() => Event.create({ company, user: _user.id, start: Date.now(), end: Date.now(), type: USER_SIGN_IN_OUT, state: ACCEPTED, description: 'Event 5', createdBy: _user.id, updatedBy: _user.id }))
                .then(() => { return 'OKK!!!' })
        }

        return promises.then(() => { })
    })

    it('should successfully retrieve all USER_HOLIDAY EVENTS', async () => {
        const _events = await unitFunction(owner, undefined, undefined, [USER_HOLIDAY])
        expect(_events).to.exist
        expect(_events).to.be.an('array')
        expect(_events.length).to.equal(20)
    })

    it('should successfully retrieve all PENDING EVENTS', async () => {
        const _events = await unitFunction(owner, undefined, undefined, undefined, PENDING)
        expect(_events).to.exist
        expect(_events).to.be.an('array')
        expect(_events.length).to.equal(40)
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

        target = (() => { })
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

        target = (() => { })
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
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a Array`)

        target = null
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a Array`)

        target = (() => { })
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a Array`)

        target = {}
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a Array`)

        target = "just a string"
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', target)).to.throw(TypeError, `${name} ${target} is not a Array`)
    })

    it('should fail on non integer state parameter', () => {
        const name = 'state'
        let target

        target = false
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', [WORK_DAY], target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = null
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', [WORK_DAY], target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = (() => { })
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', [WORK_DAY], target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = {}
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', [WORK_DAY], target)).to.throw(TypeError, `${name} ${target} is not a number`)

        target = []
        expect(() => unitFunction('a8s7dfa', '2020-03-31', '2020-04-01', [WORK_DAY], target)).to.throw(TypeError, `${name} ${target} is not a number`)
    })

    after(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})