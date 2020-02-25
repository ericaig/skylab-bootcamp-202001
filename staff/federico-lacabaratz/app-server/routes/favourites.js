const { retrieveUser, retrieveFavVehicles } = require('../logic')
const { App, Search } = require('../components')
const { logger } = require('../utils')

module.exports = (req, res) => {
    const { session: { acceptCookies, token }, params: { name } } = req
    try {
        retrieveUser(token, (error, user) => {
            if (error) {
                logger.error(error)

                res.redirect('/error')
            }

            const { name, username } = user

            retrieveFavVehicles(token, (error, vehicles) => {
                if (error) {
                    logger.error(error)

                    res.redirect(req.get('/error'))
                }
                else {
                    res.send(App({ title: 'favourites', body: Search({ name, vehicles }), acceptCookies }))
                }
            })
        })
    } catch (error) {
        logger.error(error)

        res.redirect(req.get('/error'))
    }
}
