const { validate } = require('events-utils')
const { models: { Event } } = require('events-data')
// const { NotAllowedError } = require('events-errors')

module.exports = id => {
    validate.string(id, 'publisherId')

    return Event.find({ publisher: id }).lean()
        .then(events => {
            // sanitize
            events.forEach(event => {
                event.id = event._id.toString()

                delete event._id

                event.publisher = event.publisher.toString()
            })

            return events
        })
}