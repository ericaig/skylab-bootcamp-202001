const { validate, validateSpecial, utils } = require('timekeeper-utils')
const {
    models: { WeekDay, User, Company, Event },
    utils: {
        eventStates: { ACCEPTED },
        sanitizer,
        eventTypes: { USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { NotFoundError } = require('timekeeper-errors')

module.exports = function (user) {
    validate.string(user, 'user')

    const type = USER_SIGN_IN_OUT, description = 'Sign-in > Sign-out', state = ACCEPTED

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const _weekday = await WeekDay.findOne({ company }).lean()

        if (!_weekday) throw new NotFoundError(`Company with id ${company} does not have week days created`)

        sanitizer(_weekday)

        let event = await Event.findOne({ company, user, type, end: { $exists: false } })
        const dateFormat = 'YYYY-MM-DD HH:mm:ss'

        if (!event) {
            // let's sign in
            const start = utils.now(dateFormat)
            validateSpecial.activeDayOfWeek(start, _weekday, dateFormat)

            event = new Event({ company, user, start, type, state, description, createdBy: user, updatedBy: user })
        } else {
            // let's sign out
            const end = utils.now(dateFormat)
            validateSpecial.activeDayOfWeek(end, _weekday, dateFormat)

            event.end = end
        }

        return event.save().then(() => { })
    })()
}