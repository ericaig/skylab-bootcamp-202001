const { database } = require('../data')
const { models: { Event } } = require('../data')


module.exports = () => Event.find()