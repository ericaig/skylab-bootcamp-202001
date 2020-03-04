const { validate } = require('events-utils')
const { models: { Event } } = require('../data')

module.exports = (id, publisher, data) => {
    const _event = {}

    validate.string(id, 'id')
    validate.string(publisher, 'publisher')

    const { title, description, location, date } = data

    if (typeof title !== 'undefined') {
        validate.string(title, 'title')
        _event.title = title
    }

    if (typeof description !== 'undefined') {
        validate.string(description, 'description')
        _event.description = description
    }

    if (typeof location !== 'undefined') {
        validate.string(location, 'location')
        _event.location = location
    }

    if (typeof date !== 'undefined') {
        validate.type(date, 'date', Date)
        _event.date = date
    }

    if (!Object.keys(_event).length) throw new Error('No event data received')

    return Event.findOneAndUpdate({ _id: id, publisher }, { $set: _event })
        .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })
}