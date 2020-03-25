const { validate } = require('timekeeper-utils')
const {
    models: { WeekDay, User, Company, Event },
    utils: {
        roles: { CLIENT, ADMINISTRATOR },
        eventStates,
        sanitizer,
        eventTypes: { WORK_DAY, WORK_HOLIDAY }
    }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
// const { v4: uuid } = require('uuid')

/**
 * @function
 * This retrieves company's events throught out a given month
 * @param {string} user User id
 * @param {string} start Event start date -> expected format = YYYY-MM-DD
 * @param {string} end Event end date -> expected format = YYYY-MM-DD
 * @param {number} state `Optional`. The state of the event. Pending/Accepted
 * @param {number} type `Optional`. Event type
 */
module.exports = function (user, start, end, type, state) {
    validate.string(user, 'user')
    validate.date(start)
    validate.date(end)

    if (typeof type !== 'undefined') {
        validate.number(type, 'type')

        if (![WORK_DAY, WORK_HOLIDAY].includes(Number(type))) throw new NotAllowedError(`Invalid event type ${type}`)
    }

    if (typeof state !== 'undefined'){
        validate.number(state, 'state')
        if (!Object.values(eventStates).includes(Number(state))) throw new NotAllowedError(`Invalid event state ${state}`)
    }


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

        const weekday = await WeekDay.findOne({ company }).lean()

        if (!weekday) throw new NotFoundError(`Company ${company} does not have week days created`)

        const findParams = {
            company,
            start: { "$gte": new Date(start) },
            end: { "$lte": new Date(end) }
        }

        if (typeof type !== 'undefined') findParams.type = type
        if (typeof state !== 'undefined') findParams.state = state

        const events = await Event.find(findParams).lean()

        return events.map(event => sanitizer(event))
    })()
}