const { validate } = require('timekeeper-utils')
const {
    models: { Company, User, Event },
    utils: { roles: { CLIENT, ADMINISTRATOR } }
} = require('timekeeper-data')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')

module.exports = (user, eventId) => {
    validate.string(user, 'user')
    validate.string(eventId, 'eventId')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        const { role, company } = _user

        // if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to create week days`)

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company.toString()} not found`)

        const event = await Event.findOne({ company, _id: eventId })

        if (!event) throw new NotFoundError(`Seems like event with Id ${eventId} does not exist`)

        if (![CLIENT, ADMINISTRATOR].includes(role) && user !== event.user.toString()) throw new NotAllowedError(`User ${user} does not have permission to perform this action`)

        return await event.remove().then(() => { })
    })()
}