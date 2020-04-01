const { validate } = require('timekeeper-utils')
const { models: { WeekDay, User, Company }, utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer } } = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
// const { v4: uuid } = require('uuid')

/**
 * @function
 * To create company's week days
 * @param {string} user User id
 * @returns {object} object containing the requested weekday
 * @throws error in case something goes wrong
 */
module.exports = function (user) {
    validate.string(user, 'user')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        // const { role } = _user

        // if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to view week days`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const weekday = await WeekDay.findOne({ company })
            .populate('createdBy', 'name surname -_id')
            .populate('updatedBy', 'name surname -_id')
            .lean()

        if (!weekday) throw new NotFoundError(`Company ${company} does not have week days created`)

        sanitizer(weekday)

        return weekday
    })()
}