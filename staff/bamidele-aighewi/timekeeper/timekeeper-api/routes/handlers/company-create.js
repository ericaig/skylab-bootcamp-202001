const { createCompany } = require('../../logic')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')

module.exports = (req, res) => {
    const { payload: { sub: owner }, body: { name, email, address, web, cif, city, postalCode, startTime, endTime } } = req

    try {
        createCompany(name, email, address, owner, web, cif, city, postalCode, startTime, endTime)
            .then(() => res.status(201).end())
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
            case error instanceof NotAllowedError:
                status = 403 // forbidden
        }

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}