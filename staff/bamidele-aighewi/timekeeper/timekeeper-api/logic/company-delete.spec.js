require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { models: { Event, User } } = require('events-data')
const { expect } = require('chai')
const { random } = Math
const deleteEvent = require('./delete-event')
const { mongoose } = require('events-data')

describe('deleteEvent', () => {
    // let events, users
    let title, description, location, date, eventId, publisherId
    let name, surname, email, password

    before(() => {
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    })

    beforeEach(() => {
        title = `Title - ${random()}`
        description = `Description - ${random()}`
        location = `Location - ${random()}`
        date = new Date()

        name = `Name - ${random()}`
        surname = `Surname - ${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when an event has been deleted', () => {

        beforeEach(() => {
            return User.create({ name, surname, email, password })
                .then(({ id }) => id)
                .then(publisher => {
                    publisherId = publisher
                    return Event.create({ publisher, title, description, location, date })
                }).then(({ id: insertedId }) => {
                    eventId = insertedId
                    return eventId
                })
        })

        it('should successfully delete an event', () => {
            return deleteEvent(eventId, publisherId).then((result) => {
                expect(result).to.be.undefined
            })
        })
    })

    it('should fail on retrieving non-existing event', () =>
        Event.findOne({ _id: eventId })
            .then(result => {
                expect(result).to.be.null
            })
    )

    it('it should fail on non-string eventID parametre', () => {
        const _name = 'id'
        let target

        target = 1
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = false
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = null
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = {}
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = undefined
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = []
        expect(() => deleteEvent(target, 'fake_publisher_id')).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    it('it should fail on non-string publisher parametre', () => {
        const _name = 'publisher'
        let target

        target = 1
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = false
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = null
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = {}
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = undefined
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
        target = []
        expect(() => deleteEvent('fake_publisher_id', target)).to.throw(TypeError, `${_name} ${target} is not a string`)
    })

    after(() => mongoose.disconnect())
})