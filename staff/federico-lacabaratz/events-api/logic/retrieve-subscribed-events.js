const { validate } = require('events-utils')
const { models: { Event } } = require('events-data')

module.exports = (userId) => {
    validate.string(userId, 'userId')

    return Event.find({ usersSubscribed: userId})
        .then(event => {
            return event
        })
}