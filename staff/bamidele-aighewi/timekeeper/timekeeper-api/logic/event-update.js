const { validate } = require('timekeeper-utils')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')
const {
    models: { Company, User, Event },
    utils: { roles, eventTypes, eventStates, sanitizer }
} = require('timekeeper-data')
const { validateAndReturnUpdateDatas, eventProperties, mailer } = require('../utils')
const moment = require('moment')

/**
 * @function
 * Function to update an event
 * @param  {string} user user id required to fetch company id
 * @param  {string} eventId Id of the event to update
 * @param  {object} props properties of the event to update
 * @throws error if something goes wrong
 */
module.exports = (user, eventId, props) => {
    validate.string(user, 'userId')
    validate.string(eventId, 'eventId')
    validate.object(props, 'props')

    const _event = validateAndReturnUpdateDatas(props, [
        { field: 'start', type: 'date' },
        { field: 'end', type: 'date' },
        { field: 'type', type: 'number' },
        { field: 'state', type: 'number' },
        { field: 'description', type: 'string' }
    ])

    validate.date(_event.start)
    validate.date(_event.end)

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        // const { role } = _user

        // if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to create week days`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const event = await Event.findOne({ company, _id: eventId })

        if (!event) throw new NotFoundError(`Event ${eventId} not found`)

        if (typeof _event.type !== 'undefined') {
            validate.number(_event.type, 'type')
            if (!Object.values(eventTypes).includes(Number(_event.type))) throw new NotAllowedError(`Invalid event type ${_event.type}`)
        }

        if (typeof _event.state !== 'undefined') {
            validate.number(_event.state, 'state')
            if (!Object.values(eventStates).includes(Number(_event.state))) throw new NotAllowedError(`Invalid event state ${_event.state}`)
        }

        const { type, user: eventUserId } = event
        const { role } = _user
        const { WORK_DAY, WORK_HOLIDAY, USER_SIGN_IN_OUT } = eventTypes
        const { PENDING } = eventStates
        const { CLIENT, ADMINISTRATOR, WORKER } = roles

        if ([WORK_DAY, WORK_HOLIDAY].includes(type) && ![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`--->User ${user} does not have permission to modify the event ${eventId}`)
        if (![WORK_DAY, WORK_HOLIDAY].includes(type) && role === WORKER && user !== eventUserId.toString()) throw new NotAllowedError(`<---User ${user} does not have permission to modify the event ${eventId}`)

        // let's look for overlapse
        // https://stackoverflow.com/a/26877645
        const findEventParams = {
            company,
            user,
            _id: { "$nin": [eventId] },
            type: _event.type,
            start: { "$lte": new Date(_event.end) },
            end: { "$gte": new Date(_event.start) }
        }

        if ([WORK_DAY, WORK_HOLIDAY].includes(type)) delete findEventParams.user

        const overlaps = await Event.find(findEventParams).lean()

        if (overlaps.length) throw new NotAllowedError(`There ${overlaps.length > 1 ? 'are' : 'is'} ${overlaps.length} overlapsed events between the dates ${_event.start} - ${_event.end}`)

        if (type === USER_SIGN_IN_OUT) {
            delete _event.type
            delete _event.state
        } else if (type !== USER_SIGN_IN_OUT && role === WORKER) {
            _event.state = PENDING
        }

        if (role !== WORKER && user !== eventUserId.toString() && event.state !== _event.state) {
            const eventUser = await User.findById(eventUserId).lean()
            if (!eventUser) throw new NotFoundError(`The owner ${eventUserId} of this event doesn't exist`)

            await mailer(eventUser.email, 'Update to an event', `Your event that ranges from ${moment(new Date(_event.start)).format('DD/MM/YYYY H:mm')} to ${moment(new Date(_event.end)).format('DD/MM/YYYY H:mm')} has been set to '${eventProperties.states.names[_event.state - 1]}'<br/><br/>>> ${_event.description || event.description}`)
        }

        _event.updatedAt = Date.now()
        _event.updatedBy = _user.id

        return event.updateOne(_event).then(() => { })
    })()
}