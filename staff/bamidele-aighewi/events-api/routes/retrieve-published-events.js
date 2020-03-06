const { retrievePublishedEvents } = require('../logic')
module.exports = (req, res) => {
    const { payload: { sub: id } } = req

    try {
        retrievePublishedEvents(id).then(events => {
            res.status(200).json(events)
        }).catch(({ message }) => {
            res.status(409).json({ error: message })
        })
    } catch ({ message }) {
        res.status(409).json({ error: message })
    }
}