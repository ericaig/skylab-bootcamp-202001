require('dotenv').config()

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

const { env: { TEST_MONGODB_URL } } = process

describe('eventSignInOut', () => {
    let user, company

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const _user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        const { id: userId } = _user
        user = userId

        const { id: _company } = await Company.create({ invite: uuid(), name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner: user, web: 'http://company.url', cif: 'Company-cif', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        company = _company
        _user.company = _company
        await _user.save()

        await WeekDay.create({ company, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, createdBy: user, updatedBy: user })
    })

    it('should succeed on createing a sign in and sign out', async () => {
        await eventSignInOut(user)
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

        await eventSignInOut(user)
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

    it('should fail on non-string user parameter', () => {
        const name = 'user'
        let target

        target = 1
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => eventSignInOut(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})