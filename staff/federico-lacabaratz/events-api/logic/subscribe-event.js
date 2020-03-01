const { validate } = require('../utils')
const { database, database: { ObjectId } } = require('../data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    const users = database.collection('users')
    const events = database.collection('events')

    return users.findOne({ _id: ObjectId(userId), subscribedToEvent: ObjectId(eventId) })
        .then(user => {

            if (user) throw new Error('user is already subscribed to this event')
        })
        .then(() => {
            return users.updateOne({ _id: ObjectId(userId) }, { $push: { subscribedToEvent: ObjectId(eventId) } })
        })
        .then(() => {
            return events.updateOne({ _id: ObjectId(eventId) }, { $push: { userSubscribed: ObjectId(userId) } })
                .then(() => { })
        })
}
