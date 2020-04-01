const NotFoundError = require('./not-found-error')
const NotAllowedError = require('./not-allowed-error')
const ContentError = require('./content-error')

module.exports = function(error){
    let status = 400

    switch (true) {
        case error instanceof NotFoundError:
            status = 404 // not found
            break
        case error instanceof NotAllowedError:
            status = 403 // forbidden
            break
        case error instanceof ContentError:
            status = 400 // well something is on 🔥
    }

    return status
}