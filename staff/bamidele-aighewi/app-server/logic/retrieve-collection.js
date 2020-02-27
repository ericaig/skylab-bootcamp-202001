const { fetch } = require('../utils')

module.exports = function (id) {
    if (typeof id !== 'string') throw new TypeError(`${id} is not a string`)
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    return fetch(`https://skylabcoders.herokuapp.com/api/hotwheels/collections/${id}`).then(response => {
        if (response.status === 200) {
            var result = JSON.parse(response.content)

            return result
        }
    })
}