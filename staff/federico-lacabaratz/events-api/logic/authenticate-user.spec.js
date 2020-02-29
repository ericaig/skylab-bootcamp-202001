require('dotenv').config()

const { env: { TEST_MONGODB_URL } } = process
const { database, models: { User } } = require('../data')
const { expect } = require('chai')
const { random } = Math
const { ContentError } = require('../errors')
const authenticateUser = require('./authenticate-user')

describe.only('authenticateUser', () => {
    before(() =>
        database.connect(TEST_MONGODB_URL)
            .then(() => users = database.collection('users'))
    )

    let name, surname, email, password, users

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(() =>
            users.insertOne(new User({ name, surname, email, password }))
                .then(({ insertedId }) => _id = insertedId)
        )

        it('should succeed on correct and valid and right credentials', () =>
            authenticateUser(email, password)
                .then(id => {
                    expect(id).to.be.a('string')
                    expect(id.length).to.be.greaterThan(0)
                    expect(id).to.equal(_id.toString())
                })
        )

        it('should should fail on incorrect email', () => {
            expect(() => {
                return authenticateUser(`${email}-wrong`, `${password}`).then(() => {
                    throw new Error('should not reach this point')
                })
            }).to.throw(ContentError, `${email}-wrong is not an e-mail`)
        })

        // it('should should fail on incorrect password', () => {
        //     expect(() => {
        //         return authenticateUser(`${email}`, `${password}-wrong`).then(() => {
        //             throw new Error('should not reach this point')
        //         })
        //     }).to.throw(TypeError, `${password}-wrong is not a password`)
        // })
    })

    after(() => database.disconnect())
})