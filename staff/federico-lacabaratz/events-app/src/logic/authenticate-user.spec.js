const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { authenticateUser } = require('.')

const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL

describe('authenticateUser', () => {

    beforeAll(async () => {
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
        
        beforeEach(() => {
            User.create({ name, surname, email, password })
        })

        it('should succeed on correct credentials', async () => {
            const result = await authenticateUser(email, password)

            expect(typeof result).toBe('string')
            expect(result.length).toBeGreaterThan(0)
        })

        it('should fail on incorrect email', async () => {
            email = `email-${random()}@mail.com`

            try {
                await authenticateUser(email, password)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`wrong credentials`)
            }
        })

        it('should fail on incorrect password', async () => {
            password = `password-${random()}`

            try {
                await authenticateUser(email, password)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`wrong credentials`)
            }
        })
    })

    it('should fail when user does not exist', async () => {
        email = `email-${random()}@mail.com`
        password = `password-${random()}`

            try {
                await authenticateUser(email, password)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`wrong credentials`)
            }
        })

    it('should fail on non-string email', () => {
        email = 1
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = true
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)

        email = undefined
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `email ${email} is not a string`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = true
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)

        password = undefined
        expect(() =>
            authenticateUser(email, password)
        ).toThrowError(TypeError, `password ${password} is not a string`)
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})