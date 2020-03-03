const { validate } = require('../utils')
const { models: { Event, User } } = require('../data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    return Event.deleteOne({ _id: eventId, publisher: userId })

        .then(() => {
            return User.update({ $pull: { subscribedToEvent: eventId } })
        })
        .then(() => {
            return User.update({ $pull: { publishedEvents: eventId } })
            //     // const userToModify = User.find({subscribedToEvent: eventId})

            //     // userToModify.filter(result => result !== User.find({subscribedToEvent: eventId})
        })
        .then(() => { })
}