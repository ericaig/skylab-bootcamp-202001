const { validate } = require('../utils')
const { database, database: { ObjectId } } = require('../data')
// const { NotAllowedError } = require('../errors')

module.exports = id => {
    validate.string(id, 'id')

    const publisher = ObjectId(id)
    const events = database.collection('events')
    const cursor = events.find({ publisher }).sort({ created: -1 })

    const _events = []

    return (function streamItems() {
        return cursor.hasNext()
            .then(hasNext => hasNext && cursor.next())
            .then(result => result && _events.push(result))
            .then(result => (result && streamItems()) || _events)
            // .catch(error => { throw error })
    })()
}