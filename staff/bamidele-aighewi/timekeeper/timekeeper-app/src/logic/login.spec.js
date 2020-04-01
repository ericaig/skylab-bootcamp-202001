const { random } = Math
const { expect } = require('chai')
const { mongoose, models: { User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { login } = require('.')
const bcrypt = require('bcryptjs')
const context = require('./context')
// const context = require('./context')

// const { env: { REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL } } = process
const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'

describe('login', () => {
    beforeAll(async () => {
        debugger
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
    })

    let name, surname, email, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)

            await User.create({ name, surname, email, password: _password, role: CLIENT })
                .then(user => _id = user.id)
        })

        it('should succeed on correct and valid and right credentials', () =>
            login(email, password)
                .then(() => {
                    const { token } = context

                    expect(typeof token).to.be.a('string')
                    expect(token.length).to.be.greaterThan(0)

                    const { sub } = JSON.parse(atob(token.split('.')[1]))

                    expect(sub).to.equal(_id)
                })
        )
    })

    // TODO more happies and unhappies

    afterAll(() => User.deleteMany().then(() => mongoose.disconnect()))
})