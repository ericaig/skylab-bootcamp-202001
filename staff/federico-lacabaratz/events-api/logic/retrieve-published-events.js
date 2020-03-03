const { validate } = require('../utils')
const { models: { Event } } = require('../data')
const { NotFoundError } = require('../errors')

module.exports = id => {
    validate.string(id, 'id')

    return Event.find({ publisher: id })
        .then(event => {
            if (!event) throw new NotFoundError(`event with id ${id} does not exist`)
            
            return event
        })
        
}