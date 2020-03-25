const { eventCompanyRetrieve } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: userID }, params: { start, end }, query: { type, state } } = req

    try {
        eventCompanyRetrieve(userID, start, end, type, state)
            .then(items =>
                res.status(200).json(items)
            )
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