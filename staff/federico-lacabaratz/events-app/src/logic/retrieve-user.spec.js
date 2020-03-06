const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { retrieveUser } = require('.')
const jwt = require('jsonwebtoken')

const { env: { 
    REACT_APP_TEST_MONGODB_URL: TEST_MONGODB_URL,
    REACT_APP_TEST_MONGODB_URL: TEST_JWT_SECRET } } = process

describe.only('retrieveUser', () => {
    beforeAll(async() => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
    })

    let name, surname, email, password

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let token
        beforeEach(async() => {
            const result = await User.create({ name, surname, email, password })
            const id = await result._id
            token = await jwt.sign({ sub: id }, TEST_JWT_SECRET)
        })

        it('should succeed on correct data', async () => {
            const user = await retrieveUser(token)

            expect(user).toBeDefined()
            expect(user.name).toEqual(name)
            expect(user.surname).toEqual(surname)
            expect(user.email).toEqual(email)
            expect(user.password).toBeUndefined()
            
        })
    })


    // TODO more happies and unhappies

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})