const moment = require('moment')

module.exports = {
    now(format = 'YYYY-MM-DD'){
        return moment().format(format)
    }
}