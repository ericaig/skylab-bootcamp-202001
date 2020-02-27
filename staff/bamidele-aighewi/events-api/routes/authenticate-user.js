const { authenticateUser } = require('../logic')
const jwt = require('jsonwebtoken')
const { env: { JWT_SECRET,  JWT_EXP } } = process
const { NotAllowedError } = require('../errors')

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
        const { message } = error
        let status = 400
        
        if (error instanceof NotAllowedError) status = 401

        res.status(status).json({ error: message})
    }
}