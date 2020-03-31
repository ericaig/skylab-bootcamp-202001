const { models: { User, Company }, utils: { roles: { CLIENT, ADMINISTRATOR } } } = require('timekeeper-data')
const { validate } = require('timekeeper-utils')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
/**
 * @function
 * Function to retrieve user information
 * @param  {string} user id of user making the request to retrieve their user object or of another user 
 * @param  {string} subUserId id of user `user` is trying to retrieve
 * @throws error in case something goes wrong
 */
module.exports = (user, subUserId) => {
    validate.string(user, 'user')
    if (typeof subUserId !== 'undefined') validate.string(subUserId, 'subUserId')

    return (async () => {
        let _user = await User.findById(user)

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        // sanitizer(_user)

        const { role } = _user

        if (typeof subUserId !== 'undefined' && ![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to view resource`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        if (typeof subUserId !== 'undefined') {
            _user = await User.findOne({ company, _id: subUserId })
            if (!_user) throw new NotFoundError(`User with id ${subUserId} not found`)
        }

        _user.retrieved = new Date

        return _user.save().then(({ name, surname, email, company, role }) => ({ name, surname, email, company, role }))
    })()
}