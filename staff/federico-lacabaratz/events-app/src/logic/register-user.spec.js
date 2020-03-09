const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { registerUser } = require('.')

const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL

describe('registerUser', () => {
    let name, surname, email, password

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        return await Promise.resolve(User.deleteMany())
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

    describe('when user already exists', () => {

        beforeEach(async () => {
            try {
                return await fetch('http://localhost:8089/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, surname, email, password })
                })


            } catch (error) {
                throw new Error(error)

            }
        })

        it('should fail on already registered user', async () => {
            try {
                await registerUser(name, surname, email, password)

                throw new Error('You should not reach this point')

            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`user with email ${email} already exists`)

            }
        })
    })

    it('should fail on non-string name', () => {
        name = 1
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = true
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = undefined
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)

        name = null
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `name ${name} is not a string`)
    })

    it('should fail on non-string surname', () => {
        surname = 1
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = true
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = undefined
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)

        surname = null
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = null
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = null
        expect(() =>
            registerUser(name, surname, email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})