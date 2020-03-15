const { validate } = require('timekeeper-utils')
const { models: { User, Company }, utils: { roles: { WORKER } } } = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
const bcrypt = require('bcryptjs')

module.exports = (invite, name, surname, email, password) => {
    validate.string(invite, 'invite')
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')

    let _company

    return Company.findOne({ invite })
        .then(company => {
            if (!company) throw new NotFoundError(`No company found with the invite link`)
            _company = company._id
        })
        .then(() =>
            User.findOne({ email })
        )
        .then(user => {
            if (user) throw new NotAllowedError(`Worker with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            const user = new User({ name, surname, email, password, company: _company, role: WORKER, created: new Date })

            return user.save()
        })
        .then(() => { })

}