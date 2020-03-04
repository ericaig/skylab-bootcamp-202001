const { validate } = require('events-utils')
const { models: { Event } } = require('../data')

module.exports = (_id, publisher) => {
    validate.string(_id, 'id')
    validate.string(publisher, 'publisher')

    const filterParams = { _id, publisher }

    return Event.findOne(filterParams).then(result => {
        if (!result) throw new Error(`Event with id ${_id} does not exist`)
    }).then(() => Event.deleteOne(filterParams)
        .then(() => { /* this is here (as is) because we don't want any external logic using this function (.then(res=>{})) to receive any props coming from mongodb or whatever db engine we are using to fetch datas */ })
    )
}