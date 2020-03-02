require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { database, models: { Event } } = require('../data')
const { expect } = require('chai')
const { random } = Math
const deleteEvent = require('./delete-event')
const { ObjectId } = require('mongodb')

describe('deleteEvent', () => {
    let events, users
    let title, description, location, date, id
    let name, surname, email, password

    before(() => {
        database.connect(TEST_MONGODB_URL).then(() => {
            events = database.collection('events')
            users = database.collection('users')
            return users
        })
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
        beforeEach(() =>
            users.insertOne({ name, surname, email, password })
                .then(({ insertedId }) => insertedId)
                .then(publisher =>
                    events.insertOne({ publisher: ObjectId(publisher), title, description, location, date })
                ).then(({ insertedId }) => {
                    id = insertedId
                    return id
                })
        )

        it('should successfully delete an event', () => {
            return deleteEvent(id)
        })
    })
})