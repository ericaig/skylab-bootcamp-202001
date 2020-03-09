const { random } = Math
const { retrieveUser } = require('.')
const { mongoose, models: { User } } = require('events-data')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL

const TEST_JWT_SECRET = process.env.REACT_APP_TEST_JWT_SECRET

describe('retrieveUser', () => {
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

        it('should fail on invalid token', async () => {
            try {
                await retrieveUser(`${token}-wrong`)

                throw new Error('you should not reach this point')
            } catch (error) {
                expect(error).toBeDefined()
                expect(error.message).toBe(`invalid signature`)
            }
        })
    })
    
    it('should fail on non-string token', () => {
        let token = 1
        expect(() =>
            retrieveUser(token)
        ).toThrowError(TypeError, `token ${token} is not a string`)

        token = true
        expect(() =>
            retrieveUser(token)
        ).toThrowError(TypeError, `token ${token} is not a string`)

        token = undefined
        expect(() =>
            retrieveUser(token)
        ).toThrowError(TypeError, `token ${token} is not a string`)
    })

    it('should fail on invalid token format', () => {
        let token = 'abc'

        expect(() =>
            retrieveUser(token)
        ).toThrowError(Error, 'invalid token')
    })

    afterAll(async () => {
        await Promise.resolve(User.deleteMany())
        return await mongoose.disconnect()
    })
})