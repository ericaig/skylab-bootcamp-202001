const { validate } = require('timekeeper-utils')
const { models: { WeekDay, User, Company }, utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer } } = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
// const { v4: uuid } = require('uuid')

/**
 * @function
 * To create company's week days
 * @param {string} user User id
 * @param {boolean} monday To configure this day as working day or not
 * @param {boolean} tuesday To configure this day as working day or
 * @param {boolean} wednesday To configure this day as working day or not
 * @param {boolean} thursday To configure this day as working day or not
 * @param {boolean} friday To configure this day as working day or not
 * @param {boolean} saturday To configure this day as working day or not
 * @param {boolean} sunday To configure this day as working day or not
 */
module.exports = function (user, monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    validate.string(user, 'user')
    validate.boolean(monday, 'monday')
    validate.boolean(tuesday, 'tuesday')
    validate.boolean(wednesday, 'wednesday')
    validate.boolean(thursday, 'thursday')
    validate.boolean(friday, 'friday')
    validate.boolean(saturday, 'saturday')
    validate.boolean(sunday, 'sunday')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to create week days`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const _weekday = await WeekDay.findOne({ company })

        if (_weekday) throw new NotAllowedError(`Week days already created for company ${company}`)

        const { id: userId } = _user

        const weekday = new WeekDay({ company, monday, tuesday, wednesday, thursday, friday, saturday, sunday, createdBy: userId, updatedBy: userId })

        return weekday.save().then(() => { })
    })()
}