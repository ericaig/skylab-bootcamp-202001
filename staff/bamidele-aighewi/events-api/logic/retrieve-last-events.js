const { validate } = require('events-utils')
const { models: { Event } } = require('../data')

module.exports = () => {
    return Event.find().lean().sort({ date: -1 })
}