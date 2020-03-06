const authenticateUser = require('./authenticate-user')
const { random } = Math
const { mongoose, models: { User } } = require('events-data')
const { validate } = require('events-utils')

const TEST_MONGODB_URL = process.env.REACT_APP_TEST_MONGODB_URL

describe('authenticateUser', () => {
    let name, surname, email, password

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
    })

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    describe('when user already exists', () => {
        let _id

        beforeEach(async () => {
            const { id } = await User.create({ name, surname, email, password })
            _id = id
        })

        it('should succeed on correct and valid and right credentials', async () => {
            const token = await authenticateUser(email, password)
            expect(token).to.be.a('string')
            expect(token.length).to.beGreaterThan(0)

            expect(() => validate.token(token)).not.toThrow()

            const [, payload] = token.split('.')
            const { sub: id } = JSON.parse(atob(payload))
            expect(id).to.equal(_id)
        })
    })

    describe('when user does not exist', ()=>{
        it('should fail on authenticating user with wrong credentials', async () => {
            try {
                await authenticateUser(`${email}`, `${password}-wrong`)    
            } catch (error) {
                expect(error).toBeIntanceOf(Error)
            }
        })
    })

    // TODO more happies and unhappies

    afterAll(async () => await mongoose.disconnect())
})