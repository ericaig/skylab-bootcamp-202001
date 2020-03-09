const { unsubscribeEvent } = require('../logic')
const { NotFoundError } = require('events-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId }, body: {eventId} } = req

    try {
        unsubscribeEvent(userId, eventId)
            .then(() =>
                res.status(200).json({ message: "You've successfully unsubscribe this event from the database" })
            )
            .catch(({ message }) =>
                res
                    .status(401)
                    .json({
                        error: message
                    })
            )
    } catch (error) {
        let status = 400

        switch (true) {
            case error instanceof NotFoundError:
                status = 404 // not found
                break
        }

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}