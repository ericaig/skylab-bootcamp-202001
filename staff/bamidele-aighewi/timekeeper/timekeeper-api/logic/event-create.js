const { validate, validateSpecial } = require('timekeeper-utils')
const {
    models: { WeekDay, User, Company, Event },
    utils: {
        roles: { CLIENT, ADMINISTRATOR, DEVELOPER },
        eventStates: { PENDING },
        sanitizer,
        eventTypes: { USER_HOLIDAY, USER_ABSENCE }
    }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
const moment = require('moment')

/**
 * @function
 * This helps to create general events that aren't company's calendar or User's sign ins and out
 * @param {string} user - User id
 * @param {string} start - EVent start date -> expected format = YYYY-MM-DD
 * @param {string} end - Event end date -> expected format = YYYY-MM-DD
 * @param {number} type - Event type
 * @param {string} description - Brief description about the event
 * @param {number} state - The state of the event. Pending/Accepted
 */
module.exports = function (user, start, end, type, description, state) {
    validate.string(user, 'user')
    validate.date(start)
    validate.date(end)
    validate.number(type, 'type')
    if (![USER_HOLIDAY, USER_ABSENCE].includes(type)) throw new NotAllowedError(`Invalid event type ${type}`)
    validate.string(description, 'description')
    // if (!!state.trim()) validate.number(state, 'state')
    if (typeof state !== 'undefined') validate.number(state, 'state')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        // if user does not have a higher level permission, let's set event state to pending...
        if (![DEVELOPER, CLIENT, ADMINISTRATOR].includes(role)) state = PENDING

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const _weekday = await WeekDay.findOne({ company }).lean()

        if (!_weekday) throw new NotFoundError(`Company with id ${company} does not have week days created`)

        sanitizer(_weekday)

        validateSpecial.activeDayOfWeek(start, _weekday)
        validateSpecial.activeDayOfWeek(end, _weekday)
        // if (end !== start) validateSpecial.activeDayOfWeek(end, _weekday)
        // if (end !== start) {
        //     const startDate = moment(start)
        //     const difference = moment(end).diff(startDate, 'days') + 1
        //     for (let i = 0; i < difference; i++) {
        //         validateSpecial.activeDayOfWeek(startDate.add(1, 'days').format('YYYY-MM-DD'), _weekday)
        //     }
        // }

        // let's look for overlapse
        // https://stackoverflow.com/a/26877645
        const overlaps = await Event.find({
            company,
            user,
            type,
            start: { "$lte": new Date(end) },
            end: { "$gte": new Date(start) }
        }).lean()

        if (overlaps.length) throw new NotAllowedError(`There ${overlaps.length > 1 ? 'are' : 'is'} ${overlaps.length} overlapsed event between the dates ${start} - ${end}`)

        // const { id: userId } = _user

        // TODO: validate eventType

        const event = new Event({ company, user, start, end, type, state, description, createdBy: user, updatedBy: user })
        return event.save().then(() => { })
    })()
}