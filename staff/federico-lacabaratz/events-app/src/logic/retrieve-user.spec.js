const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { retrieveUser } = require('.')
const jwt = require('jsonwebtoken')

const { env: { 
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_MONGODB_URL: JWT_SECRET } } = process

describe.only('retrieveUser', () => {
    beforeAll(async() => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })

    let name, surname, email, password, token

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {

        beforeEach(async() => {
            const result = await User.create({ name, surname, email, password })
            const id = result._id
            const token = jwt.sign({ sub: id }, JWT_SECRET)
            return token
        })

        it('should succeed on correct and valid and right data', async () => {

            const user = await retrieveUser(token)
            expect(user.constructor).to.equal(Object)
            expect(user.name).to.equal(name)
            expect(user.surname).to.equal(surname)
            expect(user.email).to.equal(email)
            expect(user.password).to.be.undefined
        })
    })


    // TODO more happies and unhappies

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})