require('dotenv').config()

const { expect } = require('chai')
const {
    mongoose,
    models: { User, Company, WeekDay },
    utils: {
        roles: { CLIENT }
    }
} = require('timekeeper-data')
const weekDaysCreate = require('./week-days-create')
const { v4: uuid } = require('uuid')

const { env: { TEST_MONGODB_URL } } = process

describe('weekDaysCreate', () => {
    let user, company
    let monday, tuesday, wednesday, thursday, friday, saturday, sunday

    before(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
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
    })

    beforeEach(() => {
        monday = true
        tuesday = true
        wednesday = true
        thursday = true
        friday = true
        saturday = false
        sunday = false
    })

    it('should succeed on createing a new Week Day', async () =>
        weekDaysCreate(user, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return WeekDay.findOne({ company })
            })
            .then(_event => {
                expect(_event).to.exist
                expect(_event.id).to.be.a('string')
                expect(_event.company.toString()).to.equal(company)
                expect(_event.monday).to.equal(monday)
                expect(_event.tuesday).to.equal(tuesday)
                expect(_event.wednesday).to.equal(wednesday)
                expect(_event.thursday).to.equal(thursday)
                expect(_event.friday).to.equal(friday)
                expect(_event.saturday).to.equal(saturday)
                expect(_event.sunday).to.equal(sunday)
            })
    )

    it('should fail on non-string user parameter', () => {
        const name = 'user'
        let target

        target = 1
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => weekDaysCreate(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non boolean monday parameter', () => {
        const name = 'monday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean tuesday parameter', () => {
        const name = 'tuesday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean wednesday parameter', () => {
        const name = 'wednesday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean thursday parameter', () => {
        const name = 'thursday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean friday parameter', () => {
        const name = 'friday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean saturday parameter', () => {
        const name = 'saturday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    it('should fail on non boolean sunday parameter', () => {
        const name = 'sunday'
        let target

        target = "Lorem Ipsum"
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = null
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = undefined
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = {}
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)

        target = []
        expect(() => weekDaysCreate('user-id', true, true, true, true, true, true, target)).to.throw(TypeError, `${name} ${target} is not a boolean`)
    })

    after(async () => {
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})