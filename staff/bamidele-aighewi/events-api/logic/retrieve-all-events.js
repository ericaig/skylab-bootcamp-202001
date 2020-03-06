const { database } = require('events-data')
const { models: { Event } } = require('events-data')


module.exports = () => Event.find()