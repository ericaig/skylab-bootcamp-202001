const { eventUpdate } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId }, params: { id }, body } = req

    try {
        eventUpdate(userId, id, body)
            .then(() => res.status(201).end())
            .catch(error =>
                res.status(errorStatus(error))
                    .json({
                        error: error.message
                    })
            )
    } catch (error) {
        let status = errorStatus(error)

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}