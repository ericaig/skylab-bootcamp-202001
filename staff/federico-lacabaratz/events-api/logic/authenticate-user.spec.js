const { authenticateUser } = require('.')
const {expect} = require('chai')


describe('authenticate', () => {
    let user

    beforeEach(() => {
        users.length = 0

        user = {
            name: `name-${Math.random()}`,
            surname: `surname-${Math.random()}`,
            email: `${Math.random()}@email.com`,
            password: `password-${Math.random()}`,

        }
    })

    describe('when user already exists', () => {
        beforeEach(() => {
            users.push(user)
        })

        it('should succeed on correct credentials', () =>
            authenticateUser(email, password)
                .then(id => {
                    expect(user.id).to.be.a('string')
                })

        )
    })
})