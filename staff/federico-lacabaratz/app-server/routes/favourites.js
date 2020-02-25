const {retrieveFavVehicles} = require('../logic')
const {App, Search} = require('../components')
const{logger} = require('../utils')

module.exports = (req, res) => {
    const { session: { acceptCookies, token }, params: { name } } = req
    try {
        retrieveFavVehicles(token, (error, vehicles) => {
            if (error) {
                logger.error(error)

                res.send(App({ title: 'Search', body: Search({ name, error }), acceptCookies }))
            }
            else {
                res.send(App({ title: 'favourites', body: Search({ name, vehicles }), acceptCookies }))
            }
        })
    } catch ({ message }) {
        logger.error(error)
        
        res.send(App({ title: 'Search', body: Search({ name, error: message }), acceptCookies }))
    }
}