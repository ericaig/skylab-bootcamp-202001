const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { registerUser } = require('.')
const { NotAllowedError } = require('events-errors')

const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL

fdescribe('registerUser', () => {
    let name, surname, email, password

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await User.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', async () => {
        const result = await registerUser(name, surname, email, password)
        expect(result).toBeUndefined()
        const user = await User.findOne({ email })

        expect(user).toBeDefined()
        expect(user.name).toBe(name)
        expect(user.surname).toBe(surname)
        expect(user.email).toBe(email)
        expect(user.password).toBe(password) // TODO encrypt this field!
        expect(user.created).toBeInstanceOf(Date)

    })

    it('should fail on already registered user', async () => {

        const result = await registerUser(name, surname, email, password)
        const user = await User.findOne({ email })
        const error = await registerUser(name, surname, user.email, password)
        

        expect(error).toThrow(NotAllowedError)
        expect(error.message).toBe(`user with email ${result.email} already exists`)
    })

    // TODO unhappy paths and other happies if exist

    afterAll(async () => {
        await User.deleteMany()
        return await mongoose.disconnect()
    })
})