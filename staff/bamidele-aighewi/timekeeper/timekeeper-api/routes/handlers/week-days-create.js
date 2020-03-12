const { weekDaysCreate } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: user }, body: { monday, tuesday, wednesday, thursday, friday, saturday, sunday } } = req

    try {
        weekDaysCreate(user, monday, tuesday, wednesday, thursday, friday, saturday, sunday)
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