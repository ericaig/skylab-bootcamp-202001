const { eventCompanyCreate } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: user }, body: { start, end, type, description, state = '1' } } = req

    try {
        eventCompanyCreate(user, start, end, type, description, state)
            .then(() => res.status(200).end())
            .catch(error =>
                res
                    .status(errorStatus(error))
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