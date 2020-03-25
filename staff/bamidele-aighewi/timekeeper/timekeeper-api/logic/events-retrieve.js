const { validate } = require('timekeeper-utils')
const {
    models: { WeekDay, User, Company, Event },
    utils: {
        roles: { CLIENT, ADMINISTRATOR, WORKER, DEVELOPER },
        eventStates,
        sanitizer,
        eventTypes,
        eventTypes : { WORK_DAY, WORK_HOLIDAY, USER_ABSENCE, USER_HOLIDAY, USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
// const { v4: uuid } = require('uuid')

/**
 * @function
 * This retrieves company's events (WORK_DAY, WORK_HOLIDAY, USER_HOLIDAY...)
 * @param {string} user User id
 * @param {string} start `Optional`. Event start date -> expected format = YYYY-MM-DD
 * @param {string} end `Optional`. Event end date -> expected format = YYYY-MM-DD
 * @param {number} state `Optional`. The state of the event. Pending/Accepted
 * @param {number} type `Optional`. Event type
 */
module.exports = function (user, start, end, type, state) {
    validate.string(user, 'user')
    if (typeof start !== 'undefined') validate.date(start)
    if (typeof end !== 'undefined') validate.date(end)

    if (typeof type !== 'undefined') {
        validate.number(type, 'type')

        if (![...Object.values(eventTypes)].includes(Number(type))) throw new NotAllowedError(`Invalid event type ${type}`)
    }

    if (typeof state !== 'undefined') {
        validate.number(state, 'state')
        if (!Object.values(eventStates).includes(Number(state))) throw new NotAllowedError(`Invalid event state ${state}`)
    }

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        // if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to create week days`)

        if (role === WORKER && ![USER_ABSENCE, USER_HOLIDAY, USER_SIGN_IN_OUT].includes(type)) throw new NotAllowedError(`User with id ${user} does not have permission to view events of the specified type`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const weekday = await WeekDay.findOne({ company }).lean()

        if (!weekday) throw new NotFoundError(`Company ${company} does not have week days created`)

        const findParams = { company }

        if (typeof start !== 'undefined') findParams.start = { "$gte": new Date(start) }
        if (typeof end !== 'undefined') findParams.end = { "$lte": new Date(end) }
        if (typeof type !== 'undefined') findParams.type = type
        if (typeof state !== 'undefined') findParams.state = state

        const events = await Event.find(findParams).sort('-start -end').lean()

        return events.map(event => sanitizer(event))
    })()
}