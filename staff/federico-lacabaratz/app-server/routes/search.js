const { searchVehicles, retrieveUser } = require('../logic')
const { logger } = require('../utils')

module.exports = (req, res) => {
    const { query: { query }, session: { token } } = req
    req.session.query = query

    try {
        if (token)
            retrieveUser(token)
                .then(user => {
                    const { name, username } = user
                    searchVehicles(token, query)
                    const { session: { acceptCookies } } = req
                        .then(vehicles => {
                            res.render('landing', { name, username, query, results: vehicles, acceptCookies })
                        })
                })
                .catch(error => {
                    logger.error(error)
                    res.redirect('/error')
                })
        else
            searchVehicles(undefined, query)
        const { session: { acceptCookies } } = req
            .then(vehicles => {
                res.render('landing', { query, results: vehicles, acceptCookies })
            })
            .catch(error => {
                logger.error(error)
                res.redirect('/error')
            })
    } catch (error) {
        logger.error(error)
        res.redirect('/error')
    }
}