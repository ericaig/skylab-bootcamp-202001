const { retrieveVehicle } = require('../logic')
const { App, Detail } = require('../components')
const { logger } = require('../utils')

module.exports = (req, res) => {
    const { session: { acceptCookies, token }, params: { id } } = req

    if (token) {
        try {
            retrieveVehicle(token, id, (error, detail) => {
                if (error) {
                    logger.error(error)

                    res.redirect(req.get('/error'))
                }
                debugger
                if (detail) {
                    res.send(App({ title: `${detail.name}`, body: Detail({ detail }), acceptCookies }))
                }
            })

        } catch (error) {
            logger.error(error)

            res.redirect(req.get('/error'))
        }
    } else {
        try {
            retrieveVehicle(undefined, id, (error, detail) => {
                if (error) {
                    logger.error(error)

                    res.redirect(req.get('/error'))
                }

                if (detail) {
                    res.send(App({ title: `${detail.name}`, body: Detail({ detail }), acceptCookies }))
                }
            })

        } catch (error) {
            logger.error(error)

            res.redirect(req.get('/error'))
        }

    }
}