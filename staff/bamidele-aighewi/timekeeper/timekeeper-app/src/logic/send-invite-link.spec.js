// require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
const { models: { User, Company, Event, WeekDay } } = require('timekeeper-data')
const { expect } = require('chai')
const unitFunction = require('./send-invite-link')
const {
    mongoose,
    utils: {
        roles: { CLIENT, WORKER },
        eventStates: { ACCEPTED, PENDING },
        eventTypes: { WORK_DAY, WORK_HOLIDAY, USER_HOLIDAY, USER_ABSENCE, USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { ContentError } = require('timekeeper-errors')
const { v4: uuid } = require('uuid')
const moment = require('moment')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('sendInviteLink', () => {
    let owner, company
    let start = moment().startOf('month').format('YYYY-MM-DD')
    let end = moment().startOf('month').add(3, 'days').format('YYYY-MM-DD')
    let invite = uuid()

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()

        const user = await User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
        owner = user.id

        context.token = jwt.sign({ sub: owner }, TEST_JWT_SECRET)

        const _company = await Company.create({ invite, name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'P0080665C', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
        company = _company.id

        user.company = company
        await user.save()
    })

    it('should successfully send message to email address', (done) => {
        unitFunction(['eric.aighews@gmail.com']).then(mail => {
            expect(mail).not.to.exist
            expect(mail).to.be.undefined
            done()
        })
    })

    it('should fail on non valid email parameter', () => {
        let target

        target = "eric@"
        expect(() => unitFunction([target])).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail"
        expect(() => unitFunction([target])).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail."
        expect(() => unitFunction([target])).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail.c"
        expect(() => unitFunction([target])).to.throw(ContentError, `${target} is not an e-mail`)
    })

    afterAll(async () => {
        await Event.deleteMany()
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
        await mongoose.disconnect()
    })
})