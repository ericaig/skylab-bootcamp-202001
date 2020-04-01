// require('dotenv').config()

// const { env: { TEST_MONGODB_URL } } = process
const { models: { User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { expect } = require('chai')
const userUpdate = require('./update-user')
const { mongoose } = require('timekeeper-data')
const { random } = Math
const bcrypt = require('bcryptjs')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('userUpdate', () => {
    let name, surname, email, password, role, _id

    beforeAll(async () => {
        await mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
        await User.deleteMany()
    })

    beforeEach(() => {
        name = `Name-${random()}`
        surname = `Surname-${random()}`
        email = `email-${random()}@mail.com`
        password = '123'
        role = CLIENT
    })

    describe('when user does not exists', () => {
        beforeEach(async () => {
            const _password = await bcrypt.hash(password, 10)
            const _user = await User.create({ name, surname, email, password: _password, role, created: new Date })
            _id = _user.id

            context.token = jwt.sign({ sub: _id }, TEST_JWT_SECRET)
        })

        it('should succeed on correct and valid and right data', () => {
            const props = { name, surname, email, password: '321', oldPassword: '123' }
            return userUpdate(props)
                .then(result => {
                    expect(result).not.to.exist
                    expect(result).to.be.undefined

                    return User.findOne({ _id, email })
                })
                .then(_user => {
                    expect(_user).to.exist
                    expect(_user.id).to.be.a('string')
                    expect(_user.id).to.equal(_id)
                    expect(_user.name).to.equal(name)
                    expect(_user.surname).to.equal(surname)
                    expect(_user.email).to.equal(email)
                    expect(_user.role).to.equal(role)

                    return bcrypt.compare(props.password, _user.password)
                })
                .then(validPassword => expect(validPassword).to.be.true)
        })
    })

    it('should fail on non object props parameter', () => {
        const name = 'props'
        let target

        target = false
        expect(() => userUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = null
        expect(() => userUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = undefined
        expect(() => userUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)

        target = 'hello world!'
        expect(() => userUpdate(target)).to.throw(TypeError, `${name} ${target} is not a Object`)
    })

    afterAll(async () => {
        await User.deleteMany()
        await mongoose.disconnect()
    })
})