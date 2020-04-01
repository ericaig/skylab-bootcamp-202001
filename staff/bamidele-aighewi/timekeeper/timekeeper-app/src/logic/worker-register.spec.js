// require('dotenv').config()

const { expect } = require('chai')
const { random } = Math
const { mongoose, models: { User, Company }, utils: { roles: { WORKER, CLIENT } } } = require('timekeeper-data')
const workerRegister = require('./worker-register')
const bcrypt = require('bcryptjs')
const { ContentError } = require('timekeeper-errors')
const { v4: uuid } = require('uuid')

const context = require('./context')
const jwt = require('jsonwebtoken')

const TEST_MONGODB_URL = 'mongodb://localhost:27017/test-timekeeper'
const TEST_JWT_SECRET = "my_jwt_awesome_secret_phrase"

describe('workerRegister', () => {
    let name, surname, email, password
    let owner, company, invite

    beforeAll(() =>
        mongoose.connect(TEST_MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() =>
                User.deleteMany()
            )
            .then(() => Company.deleteMany())
            .then(() =>
                // create client
                User.create({ name: 'Client-name', surname: 'Client-surname', email: 'client@mail.com', password: '123', role: CLIENT })
            ).then(({ _id: _owner }) => {
                // create client's company
                owner = _owner

                context.token = jwt.sign({ sub: owner }, TEST_JWT_SECRET)

                const _invite = uuid()
                return Company.create({ invite: _invite, name: 'Company-name', email: 'Company-email@mail.com', address: 'Company-address', owner, web: 'http://company.url', cif: 'Company-cif', city: 'Company-city', postalCode: '08560', startTime: '08:00', endTime: '17:00' })
                    .then(({ id }) => {
                        company = id
                        return _invite
                    })
            }).then(_invite => {
                // retrieve company's invite link to create workers
                invite = _invite
            })
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', () =>
        workerRegister(invite, name, surname, email, password)
            .then(result => {
                expect(result).not.to.exist
                expect(result).to.be.undefined

                return User.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.created).to.be.instanceOf(Date)
                expect(user.role).to.equal(WORKER)

                return bcrypt.compare(password, user.password)
            })
            .then(validPassword => expect(validPassword).to.be.true)
    )

    it('should fail on non-string token parameter', () => {
        const name = 'token'
        let target

        target = 1
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => workerRegister(target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string name parameter', () => {
        const name = 'name'
        let target

        target = 1
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => workerRegister('invite-token', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    it('should fail on non-string surname parameter', () => {
        const name = 'surname'
        let target

        target = 1
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => workerRegister('invite-token', 'Eric', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    // it('should fail on non-string email parameter', () => {
    //     const name = 'email'
    //     let target

    //     target = 1
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

    //     target = false
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

    //     target = null
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

    //     target = undefined
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

    //     target = {}
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)

    //     target = []
    //     expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    // })

    it('should fail on non valid email parameter', () => {
        let target

        target = "eric@"
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail"
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail."
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)

        target = "eric@mail.c"
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', target)).to.throw(ContentError, `${target} is not an e-mail`)
    })

    it('should fail on non-string password parameter', () => {
        const name = 'password'
        let target

        target = 1
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = false
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = null
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = undefined
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = {}
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)

        target = []
        expect(() => workerRegister('invite-token', 'Eric', 'Aig', 'eric@mail.com', target)).to.throw(TypeError, `${name} ${target} is not a string`)
    })

    afterAll(async () => {
        await User.deleteMany()
        await Company.deleteMany()
        await mongoose.disconnect()
    })
})