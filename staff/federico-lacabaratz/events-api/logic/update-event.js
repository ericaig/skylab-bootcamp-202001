const { validate } = require('events-utils')
const { models: { Event } } = require('events-data')

module.exports = (userId, body, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    return Event.findOneAndUpdate({ _id: eventId, publisher: userId }, { $set: body })
        .then(() => { })
}