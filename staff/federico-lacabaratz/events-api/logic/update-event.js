const { validate } = require('../utils')
const { models: { Event } } = require('../data')

module.exports = (userId, body, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    return Event.findOneAndUpdate({ _id: eventId, publisher: userId }, { $set: body })
        .then(() => { })
}