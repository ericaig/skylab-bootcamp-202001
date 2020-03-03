const { validate } = require('../utils')
const { models: { Event } } = require('../data')

module.exports = (userId) => {
    validate.string(userId, 'userId')

    return Event.find({ usersSubscribed: userId})
        .then(event => {
            return event
        })
}
