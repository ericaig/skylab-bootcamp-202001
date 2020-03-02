const { validate } = require('../utils')
const { NotFoundError } = require('../errors')
const { database, database: { ObjectId }, models: { Event } } = require('../data')

module.exports = (userId) => {
    validate.string(userId, 'userId')

    const events = database.collection('events')
    const users = database.collection('users')

    return users.findOne({ _id: ObjectId(userId) }).then(result => {
        if (!result) throw new Error(`User with id ${userId} does not exist`)
        return result
    }).then(user => {
        // user exists. Let's recover their subscribed events

        if ('subscribedEvents' in user) {
            const { subscribedEvents } = user

            const cursor = events.find({ _id: { $in: subscribedEvents } })

            const _events = []

            return (function streamItems() {
                return cursor.hasNext()
                    .then(hasNext => hasNext && cursor.next())
                    .then(result => result && _events.push(result))
                    .then(result => (result && streamItems()) || _events)
                // .catch(error => { throw error })
            })()
        }


        throw new NotFoundError(`User ${userId} has no subscribed events`)
        
    })
    // .then(events => events) // redundant
}