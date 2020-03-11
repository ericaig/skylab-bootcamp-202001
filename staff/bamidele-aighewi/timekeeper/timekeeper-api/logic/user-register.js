const { validate } = require('timekeeper-utils')
const { models: { User }, roles } = require('timekeeper-data')
const { NotAllowedError } = require('timekeeper-errors')
const bcrypt = require('bcryptjs')

module.exports = (name, surname, email, password, role) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            user = new User({ name, surname, email, password, role, created: new Date })

            return user.save()
        })
        .then(() => { })

}