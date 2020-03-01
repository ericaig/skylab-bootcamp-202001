const { validate } = require('../utils')
const { database, database: { ObjectId } } = require('../data')

module.exports = (userId) => {
    validate.string(userId, 'userId')

    const events = database.collection('events')

    return events.find({ userSubscribed: ObjectId(userId) }).toArray()

        .then(event => {

            return event
        })
}
