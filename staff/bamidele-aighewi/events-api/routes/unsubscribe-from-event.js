const { unSubscribeFromEvent } = require('../logic')
const { ContentError, NotFoundError } = require('events-errors')

module.exports = (req, res) => {
    const { params: { id: userId }, payload: { sub: _userId }, body: { id: eventId } } = req


    try {
        if (userId !== _userId) return res.status(401).json({ message: 'Unauthorized request' })

        unSubscribeFromEvent(userId, eventId)
            .then(() => res.status(201).end())
            .catch(error => {
                let status = 400

                if (error instanceof NotFoundError)
                    status = 404

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