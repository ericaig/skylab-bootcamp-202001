const { validate } = require('../utils')
const { database, database: { ObjectId } } = require('../data')

module.exports = (userId, body, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    const events = database.collection('events')

    return events.findOne({ _id: ObjectId(eventId), publisher: ObjectId(userId) })
        .then(() => {
            return events.updateOne({ _id: ObjectId(eventId) }, { $set: body })
        })
        .then(() => { })
}