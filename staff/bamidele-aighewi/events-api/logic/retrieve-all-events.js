const { database } = require('../data')

module.exports = () => {
    const events = database.collection('events')

    const cursor = events.find({})

    const _events = [] 

    return (function streamItems() {
        return cursor.hasNext()
            .then(hasNext => hasNext && cursor.next())
            .then(result => result && _events.push(result))
            .then(result => (result && streamItems()) || _events)
        // .catch(error => { throw error })
    })()
}