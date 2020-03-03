const { validate } = require('../utils')
const { models: { Event } } = require('../data')
// const { NotAllowedError } = require('../errors')

module.exports = id => {
    validate.string(id, 'publisherId')

    return Event.find({publisher: id})
}