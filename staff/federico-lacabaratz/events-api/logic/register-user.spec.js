require('dotenv').config()

const { expect } = require('chai')
const { ObjectId } = require('mongodb')
const { random } = Math
const { database } = require('../data')
const { registerUser } = require('../logic')
const { NotAllowedError } = require('../errors')

const { env: { MONGODB_URL } } = process

describe.only('registerUser', () => {
    let name, surname, email, password, users

    before(() =>
        database.connect(MONGODB_URL)
            .then(() => users = database.collection('users'))
    )

    beforeEach(() => {
        name = `name-${random()}`
        surname = `surname-${random()}`
        email = `email-${random()}@mail.com`
        password = `password-${random()}`
    })

    it('should succeed on correct user data', () =>
        registerUser(name, surname, email, password)
            .then(result => {
                expect(result).not.to.exist // works like undefined
                expect(result).to.be.undefined

                return users.findOne({ email })
            })
            .then(user => {
                expect(user).to.exist
                expect(user._id).to.be.instanceOf(ObjectId)
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.email).to.equal(email)
                expect(user.password).to.equal(password) // TODO encrypt this field!
                expect(user.created).to.be.instanceOf(Date)
            })
    )

    it('should fail on non-string name', () => {
        name = 1
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `name ${name} is not a string`)
    
        name = {}
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `name ${name} is not a string`)
    
        name = []
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `name ${name} is not a string`)
    
        name = undefined
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `name ${name} is not a string`)
        
        name = null
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `name ${name} is not a string`)
    })

    it('should fail on non-string surname', () => {
        surname = 1
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `surname ${surname} is not a string`)
    
        surname = {}
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `surname ${surname} is not a string`)
    
        surname = []
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `surname ${surname} is not a string`)
    
        surname = undefined
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `surname ${surname} is not a string`)
        
        surname = null
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `surname ${surname} is not a string`)
    })

    it('should fail on non-string password', () => {
        password = 1
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `password ${password} is not a string`)
    
        password = {}
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `password ${password} is not a string`)
    
        password = []
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `password ${password} is not a string`)
    
        password = undefined
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `password ${password} is not a string`)
        
        password = null
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `password ${password} is not a string`)
    })

    it('should fail on non-string, or wrong formatted email', () => {
        email = 1
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `email ${email} is not a string`)
    
        email = {}
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `email ${email} is not a string`)
    
        email = []
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `email ${email} is not a string`)
    
        email = undefined
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `email ${email} is not a string`)
        
        email = null
        expect(() => {
            return registerUser(name, surname, email, password).then(() => {
                throw new Error('should not reach this point')
            })
        }).to.throw(TypeError, `email ${email} is not a string`)
    })

    after(() => database.disconnect())
})