const { usersRetrieve } = require('../../logic')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: id } } = req

    try {
        usersRetrieve(id)
            .then(users =>
                res.status(200).json(users)
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