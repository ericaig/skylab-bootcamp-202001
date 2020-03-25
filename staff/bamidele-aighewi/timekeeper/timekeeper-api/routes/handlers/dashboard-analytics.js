const { dashboardAnalytics } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: user }, query: { date } } = req

    try {
        dashboardAnalytics(user, { date })
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