const { validate } = require('../utils')
const { database, database: { ObjectId } } = require('../data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    const users = database.collection('users')
    const events = database.collection('events')

    return users.findOne({ _id: ObjectId(userId) })
        .then(user => {

            if (user.subscribedToEvent && !user.subscribedToEvent.includes(eventId) || !user.subscribedToEvent) {
                return users.updateOne({ _id: ObjectId(userId) }, { $push: { subscribedToEvent: ObjectId(eventId) } })
            }
        })
        .then(() => events.findOne({ _id: ObjectId(eventId) }))
        .then(event => {
            
            if (event.userSubscribed && !event.userSubscribed.includes(userId) || !event.userSubscribed) {
                return events.updateOne({ _id: ObjectId(eventId) }, { $push: { userSubscribed: ObjectId(userId) } })
                }
            })
            .then(() => { })
}
