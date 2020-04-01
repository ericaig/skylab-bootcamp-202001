// require('dotenv').config()

const { expect } = require('chai')
const {
    mongoose,
    models: { User, Company, WeekDay, Event },
    utils: {
        roles: { CLIENT },
        eventTypes: { USER_SIGN_IN_OUT },
        eventStates: { ACCEPTED }
    }
} = require('timekeeper-data')
const eventSignInOut = require('./event-sign-in-out')
const { v4: uuid } = require('uuid')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('eventSignInOut', () => {
    let user, company

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

    it('should succeed on createing a sign in and sign out', async () => {
        await eventSignInOut()
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return Event.findOne({ company, user, type: USER_SIGN_IN_OUT, state: ACCEPTED })
            })
            .then(_event => {
                expect(_event).to.exist
                expect(_event.id).to.be.a('string')
                expect(_event.company.toString()).to.equal(company)
                expect(_event.user.toString()).to.equal(user)
                expect(_event.type).to.equal(USER_SIGN_IN_OUT)
                expect(_event.state).to.equal(ACCEPTED)
                expect(_event.start).to.be.instanceOf(Date)
                expect(_event.end).to.be.undefined
            })

        await eventSignInOut()
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return Event.findOne({ company, user, type: USER_SIGN_IN_OUT, state: ACCEPTED })
            })
            .then(_event => {
                expect(_event).to.exist
                expect(_event.id).to.be.a('string')
                expect(_event.company.toString()).to.equal(company)
                expect(_event.user.toString()).to.equal(user)
                expect(_event.type).to.equal(USER_SIGN_IN_OUT)
                expect(_event.state).to.equal(ACCEPTED)
                expect(_event.start).to.be.instanceOf(Date)
                expect(_event.end).to.be.instanceOf(Date)
            })
    })

    afterAll(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})