const { validate } = require('../utils')
const { models: { Event } } = require('../data')

module.exports = () => {
    return Event.find().lean().sort({ date: -1 })
}