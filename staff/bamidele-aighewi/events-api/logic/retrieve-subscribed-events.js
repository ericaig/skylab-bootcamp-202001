const { validate } = require('events-utils')
const { NotFoundError } = require('events-errors')
const { models: { Event, User } } = require('../data')

module.exports = (userId) => {
    validate.string(userId, 'userId')

    return User.findOne({ _id: userId }).then(user => {
        if (!user) throw new Error(`User with id ${userId} does not exist`)
        return user
    }).then(user => {
        // const _user = user//.toJSON()
        // user exists. Let's recover their subscribed events

        if ('subscribedEvents' in user) {
            const { subscribedEvents } = user

            const cursor = Event.find({ _id: { $in: subscribedEvents } }).cursor()

            const _events = []

            (function*() {
                const cursor1 = Event.find({ _id: { $in: subscribedEvents } }).cursor()
                for (let doc = yield cursor1.next(); doc != null; doc = yield cursor1.next()) {
                    // _events.push(doc)
                    console.log(doc);
                }
            })()

            return (function streamItems() {
                return cursor.next()
                    .then(result => {
                        if(result) _events.push(result)
                        return result
                    })
                    .then(result => (result && streamItems()) || _events)
            })()
        }


        throw new NotFoundError(`User ${userId} has no subscribed events`)

    })
    // .then(events => events) // redundant
}