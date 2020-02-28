const { authenticateUser } = require('../logic')
const jwt = require('jsonwebtoken')
const { NotFoundError, ContentError } = require('../errors')

const { env: { JWT_SECRET, JWT_EXP } } = process

module.exports = (req, res) => {
    const { body: { email, password } } = req

    try {
        authenticateUser(email, password)
            .then(id => {
                const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXP })

                res.status(200).json({ token })
            })
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
                status = 404
                break
            case error instanceof ContentError:
                status = 401
        }

        const { message } = error

        res
            .status(status)
            .json({
                error: message
            })
    }
}