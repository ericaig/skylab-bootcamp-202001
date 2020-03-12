const { weekDaysUpdate } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: userId }, body } = req

    try {
        weekDaysUpdate(userId, body)
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