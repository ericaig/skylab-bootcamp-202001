const { retrieveSubscribedEvents } = require('../logic')
const { ContentError } = require('events-errors')

module.exports = (req, res) => {
    const { params: { id: userId }, payload: { sub: _userId } } = req

    try {
        if (userId !== _userId) return res.status(401).json({ message: 'Unauthorized request' })

        retrieveSubscribedEvents(userId)
            .then(events => res.status(200).json(events))
            .catch(error => {
                let status = 400

                const { message } = error

                res
                    .status(status)
                    .json({
                        error: message
                    })
            })
    } catch (error) {
        let status = 400

        if (error instanceof TypeError || error instanceof ContentError)
            status = 406 // not acceptable

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}