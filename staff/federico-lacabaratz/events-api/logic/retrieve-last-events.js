const { database } = require('../data')

module.exports = () => {

    const events = database.collection('events')

    return events.find().sort({created: -1}).toArray()
        .then(events => {

            return events
        })
}