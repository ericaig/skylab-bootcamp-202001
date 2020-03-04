const { validate } = require('events-utils')
const { models: { User, Event } } = require('events-data')


module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')


    return User.findOne({ _id: userId, subscribedToEvent: eventId})
        .then(user => {

            if (user) throw new Error('user is already subscribed to this event')
        })
        .then(() => {
            return User.updateOne({ _id: userId }, { $push: { subscribedToEvent: eventId } })
        })
        .then(() => {
            return Event.updateOne({ _id: eventId }, { $push: { usersSubscribed: userId } })
                .then(() => { })
        })
}