const fs = require('fs')
const moment = require('moment')
const config = require('./app-config')

const logger = {
    __host__: '',
    set host(host) { this.__host__ = host },
    get host() { return this.__host__ },

    __dateTime__() {
        return moment().format()
    },
    __write__(type, message, callback = () => { }) {
        fs.appendFile('server.log', `${type}\t${this.__dateTime__()}\t${this.host ? this.host : 'localhost'}\t${message}\n`, (error) => {
            if (error) {
                return callback(error.message)
            }

            callback('OK')
        })
    },
    debug(message, callback) { 
        config.debugger && this.__write__('DEBUG', `${message}`, callback)
    },
    log(message, callback) { this.__write__('LOG', `${message}`, callback) },
    info(message, callback) { this.__write__('INFO', `${message}`, callback) },
    error(message, callback) { this.__write__('ERROR', `${message}`, callback) },
    warn(message, callback) { this.__write__('WARN', `${message}`, callback) },
    fatal(message, callback) { this.__write__('FATAL', `${message}`, callback) }
}

if (typeof module !== 'undefined') {
    module.exports = logger
}