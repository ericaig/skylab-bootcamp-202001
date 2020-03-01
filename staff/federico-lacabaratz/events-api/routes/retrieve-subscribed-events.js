const { retrieveSubscribedEvents } = require('../logic')
const {  NotFoundError } = require('../errors')

module.exports = (req, res) => {
    const { payload: { sub: userId } } = req

    try {
        retrieveSubscribedEvents(userId)
            .then(event =>
                res.status(200).json(event)
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

        const {message} = error

        res
            .status(status)
            .json({ 
                error: message
            })
    }
}