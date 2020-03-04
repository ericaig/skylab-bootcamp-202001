const { validate } = require('events-utils')
const { models: { Event } } = require('../data')
// const { NotAllowedError } = require('events-errors')

module.exports = id => {
    validate.string(id, 'publisherId')

    return Event.find({publisher: id})
}