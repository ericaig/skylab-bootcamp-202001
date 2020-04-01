const context = require('./context')

module.exports = (function () {
    return !!this.token
}).bind(context)