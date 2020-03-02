const { validate } = require('../utils')
const { database, database: { ObjectId }, models: { Event } } = require('../data')

module.exports = (id, publisher) => {
    validate.string(id, 'id')
    validate.string(publisher, 'publisher')

    const events = database.collection('events')

    const filterParams = { _id: ObjectId(id), publisher: ObjectId(publisher) }

    return events.findOne(filterParams).then(result => {
        if (!result) throw new Error(`Event with id ${id} does not exist`)
    }).then(() => events
        .deleteOne(filterParams)
        .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })
    )

    return events.insertOne(new Event({ publisher: ObjectId(publisher), title, description, location, date }))
        .then(() => { })
}