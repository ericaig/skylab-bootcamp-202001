const { validate } = require('events-utils')
const { NotFoundError } = require('events-errors')
const { models: { Event, User } } = require('events-data')

module.exports = (userId, eventId) => {
    validate.string(userId, 'userId')
    validate.string(eventId, 'eventId')


    return Event.findOne({ _id: eventId }).then(result => {
        if (!result) throw new Error(`Event with id ${eventId} does not exist`)
    }).then(() => {
        // event exists. Let's recover user's subscribed events and let's match them with eventId

        return User.findOne({ _id: userId })
            .then(user => {
                const _user = user.toJSON()

                if ('subscribedEvents' in _user) {
                    const { subscribedEvents } = _user

                    // let's check if user has already subscribed to event or not
                    const index = subscribedEvents.findIndex(item => item.toString() === eventId)

                    if (index !== -1) {
                        subscribedEvents.splice(index, 1)
                        user.subscribedEvents = subscribedEvents
                        return user.save()
                    }
                }

                // 304 response ????? 
                throw new NotFoundError(`Has to be previously subscribed to event ${eventId} to be able to unsubscribe from it. No changes made`)
            })
            .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })
    })
}