// require('dotenv').config()

const { expect } = require('chai')
const {
    mongoose,
    models: { User, Company, Event, WeekDay },
    utils: {
        roles: { CLIENT, WORKER },
        eventTypes: { USER_HOLIDAY, USER_ABSENCE, USER_SIGN_IN_OUT },
        eventStates: { PENDING, ACCEPTED }
    }
} = require('timekeeper-data')
const unitFunction = require('./dashboard-analytics')
const { v4: uuid } = require('uuid')
const { random } = Math
const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('dashboardAnalytics', () => {
    let client, company

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const createUser = async (role, __company) => {
            let clientObj = {}
            clientObj.name = `name-${random()}`
            clientObj.surname = `surname-${random()}`
            clientObj.email = `email-${random()}@mail.com`
            clientObj.password = `password-${random()}`
            clientObj.role = role

            if (typeof __company !== 'undefined') clientObj.company = __company

            return User.create(clientObj)
        }

        const __client = await createUser(CLIENT)
        const __company = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner: __client._id, web: 'http://company.url', cif: 'Company-cif', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })

        context.token = jwt.sign({ sub: __client.id }, TEST_JWT_SECRET)

        await WeekDay.create({ company: __company.id, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, createdBy: __client._id, updatedBy: __client._id })

        __client.company = __company.id

        company = __company.id
        client = __client.id

        await __client.save()

        const roles = [WORKER]
        // const promises = []

        let promises = Promise.resolve()

        for (let x = 0; x < 20; x++) {
            roles.forEach(role => {
                let _user
                promises = promises
                    .then(() => createUser(role, __company.id))
                    .then(__user => _user = __user)
                    .then(() => Event.create({ company: __company.id, user: _user.id, start: Date.now(), end: Date.now(), type: USER_HOLIDAY, state: PENDING, description: 'Event 3', createdBy: _user.id, updatedBy: _user.id }))
                    .then(() => Event.create({ company: __company.id, user: _user.id, start: Date.now(), end: Date.now(), type: USER_ABSENCE, state: PENDING, description: 'Event 4', createdBy: _user.id, updatedBy: _user.id }))
                    .then(() => Event.create({ company: __company.id, user: _user.id, start: Date.now(), end: Date.now(), type: USER_SIGN_IN_OUT, state: ACCEPTED, description: 'Event 5', createdBy: _user.id, updatedBy: _user.id }))
                    .then(() => { return 'OKK!!!' })
            })
        }

        return promises.then(() => { })
    })

    it('should successfully recover dashboard analytics', async () => {
        // const users = await User.find({ company }).count()
        const workers = await User.find({ company, role: WORKER }).count()
        const pending = await Event.find({ company, state: PENDING }).count()
        const absences = await Event.find({ company, type: USER_ABSENCE }).count()
        const holidays = await Event.find({ company, type: USER_HOLIDAY }).count()

        return unitFunction().then(analytics => {
            expect(analytics).to.exist
            expect(analytics).to.be.an('object')

            const { totalPendingEvents, totalAbsences, totalHolidays, totalWorkers, inactiveUsers, activities } = analytics
            expect(totalPendingEvents).to.equal(pending)
            expect(totalAbsences).to.equal(absences)
            expect(totalHolidays).to.equal(holidays)
            expect(workers).to.equal(totalWorkers)

            expect(inactiveUsers).to.exist
            expect(activities).to.exist
        })
    })

    afterAll(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})