const { retrieveLastEvents } = require('../logic')
const {  ContentError } = require('events-errors')

module.exports = (req, res) => {

    try {
        retrieveLastEvents()
            .then(event =>
                res.status(200).json(event)
            )
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
            case error instanceof ContentError:
                status = 406 // not allowed
                break
        }

        const {message} = error

        res
            .status(status)
            .json({ 
                error: message
            })
    }
}