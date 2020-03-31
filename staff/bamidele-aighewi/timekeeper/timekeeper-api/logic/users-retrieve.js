const { validate } = require('timekeeper-utils')
const { models: { User, Company }, utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer } } = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
// const { v4: uuid } = require('uuid')

/**
 * @function
 * Function to retrieve all users
 * @param  {string} user id of user making the request to retrieve all users from their company
 * @throws error in case something goes wrong
 */
module.exports = function (user) {
    validate.string(user, 'user')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to view resource`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const users = await User.find({ company }).sort('name surname').lean()

        return users.map(item => sanitizer(item))
    })()
}