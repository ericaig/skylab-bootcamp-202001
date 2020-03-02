const { validate } = require('../utils')
const { database, database: { ObjectId }, models: { Event } } = require('../data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    const events = database.collection('events')
    const users = database.collection('users')

    return events.findOne({ _id: ObjectId(eventId) }).then(result => {
        if (!result) throw new Error(`Event with id ${eventId} does not exist`)
    }).then(() => {
        // event exists. Let's recover user's subscribed events and let's match them with eventId

        return users.findOne({ _id: ObjectId(userId) })
            .then(user => {
                let subscribedEvents = []

                if ('subscribedEvents' in user) {
                    const { subscribedEvents: _subscribedEvents } = user

                    // let's check if user has already subscribed to event or not
                    const exists = _subscribedEvents.find(item => item.toString() === eventId)

                    if (exists) throw new Error(`User has already subscribed to the event ${eventId}`)

                    subscribedEvents = _subscribedEvents
                }

                subscribedEvents.push(ObjectId(eventId))

                // now let's update user with the new event subscription
                return users.updateOne({ _id: ObjectId(userId) }, { $set: { subscribedEvents: subscribedEvents } })
            })
            .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })

    })
}