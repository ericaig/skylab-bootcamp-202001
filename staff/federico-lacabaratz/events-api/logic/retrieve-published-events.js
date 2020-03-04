const { models: { Event } } = require('events-data')
const { validate } = require('events-utils')
const { NotFoundError } = require('events-errors')

module.exports = id => {
    validate.string(id, 'id')

    return Event.find({ publisher: id })
        .then(event => {
            if (!event) throw new NotFoundError(`event with id ${id} does not exist`)
            
            return event
        })
        
}