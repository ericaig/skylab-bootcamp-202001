const { subscribeEvent } = require('../logic')
const {  NotAllowedError } = require('events-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId }, body: {eventId} } = req

    try {
        subscribeEvent(userId, eventId)
            .then(() =>
                res.status(200).json({message: "You're now subscribed to this event(unless you're already subscribed?)"})
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
            case error instanceof NotAllowedError:
                status = 404 // not found
                break
        }

        const {message} = error

        res
            .status(status)
            .json({ 
                error: message
            })
    }
}