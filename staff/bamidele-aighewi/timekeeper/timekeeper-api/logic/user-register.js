const { validate } = require('timekeeper-utils')
const { models: { User } } = require('timekeeper-data')
const { NotAllowedError } = require('timekeeper-errors')
const bcrypt = require('bcryptjs')
/**
 * @function
 * Function to create a new user
 * @param  {string} name name of the user to create
 * @param  {string} surname surname of the user to create
 * @param  {email} email email of the user to create
 * @param  {string} password password of the user to create
 * @param  {number} role role of the user to create
 * @throws error in case something goes wrong
 */
module.exports = (name, surname, email, password, role) => {
    validate.string(name, 'name')
    validate.string(surname, 'surname')
    validate.string(email, 'email')
    validate.email(email)
    validate.string(password, 'password')
    validate.number(role, 'role')

    // TODO: check that role is valid

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            const user = new User({ name, surname, email, password, role, created: new Date })

            return user.save()
        })
        .then(() => { })

}