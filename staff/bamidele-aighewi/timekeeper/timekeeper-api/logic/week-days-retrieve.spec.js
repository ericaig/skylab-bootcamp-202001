require('dotenv').config()

const { expect } = require('chai')
const {
    mongoose,
    models: { User, Company, WeekDay },
    utils: {
        roles: { CLIENT },
    }
} = require('timekeeper-data')
const weekDaysRetrieve = require('./week-days-retrieve')
const { v4: uuid } = require('uuid')

const { env: { TEST_MONGODB_URL } } = process

describe('weekDaysRetrieve', () => {
    let user, company

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

        await WeekDay.create({ company, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true, createdBy: user, updatedBy: user })
    })

    it('should succeed on creating a new Week Day', async () =>
        weekDaysRetrieve(user)
            .then(_weekday => {
                expect(_weekday).to.exist
                expect(_weekday.id.toString()).to.be.a('string')
                expect(_weekday.company.toString()).to.equal(company)
                expect(typeof _weekday.monday).to.equal('boolean')
                expect(typeof _weekday.tuesday).to.equal('boolean')
                expect(typeof _weekday.wednesday).to.equal('boolean')
                expect(typeof _weekday.thursday).to.equal('boolean')
                expect(typeof _weekday.friday).to.equal('boolean')
                expect(typeof _weekday.saturday).to.equal('boolean')
                expect(typeof _weekday.sunday).to.equal('boolean')
            })
    )

    it('should fail on non-string user parameter', () => {
        const name = 'user'
        let target

        target = 1
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => weekDaysRetrieve(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    after(async () => {
        await WeekDay.deleteMany()
        await Company.deleteMany()
        await User.deleteMany()
    })
})