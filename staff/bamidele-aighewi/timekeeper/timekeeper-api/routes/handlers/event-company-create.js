const { eventCompanyCreate } = require('../../logic')
const { errorStatus } = require('timekeeper-errors')
const { utils: { eventStates: { ACCEPTED } } } = require('timekeeper-data')

module.exports = (req, res) => {
    const { payload: { sub: user }, body: { start, end, type, description } } = req
    // , state = '1'

    try {
        eventCompanyCreate(user, start, end, type, description, ACCEPTED)
            .then(() => res.status(201).end())
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