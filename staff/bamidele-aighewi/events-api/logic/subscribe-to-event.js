const { validate } = require('events-utils')
const { models: { Event, User } } = require('../data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')

    return Event.findOne({ _id: eventId }).then(result => {
        if (!result) throw new Error(`Event with id ${eventId} does not exist`)
    }).then(() => {
        // event exists. Let's recover user's subscribed events and let's match them with eventId

        return User.findOne({ _id: userId })
            .then(user => {
                let subscribedEvents = []
                const _user = user.toJSON()

                if ('subscribedEvents' in _user) {
                    const { subscribedEvents: _subscribedEvents } = _user

                    // let's check if user has already subscribed to event or not
                    const exists = _subscribedEvents.find(item => item.toString() === eventId)

                    if (exists) throw new Error(`User has already subscribed to the event ${eventId}`)

                    subscribedEvents = _subscribedEvents
                }

                subscribedEvents.push(eventId)
                user.subscribedEvents = subscribedEvents

                // now let's update user with the new event subscription
                return user.save()
            })
            .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })
    })
}