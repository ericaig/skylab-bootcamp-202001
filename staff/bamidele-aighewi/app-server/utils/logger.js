const fs = require('fs')
const moment = require('moment')
const config = require('./app-config')

const LEVELS = ['LOG', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL']

let ws

const logger = {
    __host__: '',
    __level__: this.LOG,
    __path__: undefined,
    set host(host) { this.__host__ = host },
    get host() { return this.__host__ },
    set level(level) { this.__level__ = level },
    set path(path) { this.__path__ = path },

    __dateTime__() {
        return moment().format()
    },
    __write__(level, message, callback = () => { }) {
        if (level >= this.__level__) {
            fs.appendFile('server.log', `${LEVELS[level]}\t${this.__dateTime__()}\t${this.host ? this.host : 'localhost'}\t${message}\n`, (error) => {
                if (error) {
                    return callback(error.message)
                }

                callback('OK')
            })

            // if (!ws) ws = fs.createWriteStream(this.__path__, { flags: 'a' })
            // ws.write(`${output}\n`)
        }
    },
    debug(message, callback) { this.__write__(this.DEBUG, `${message}`, callback) },
    log(message, callback) { this.__write__(this.LOG, `${message}`, callback) },
    info(message, callback) { this.__write__(this.INFO, `${message}`, callback) },
    error(message, callback) { this.__write__(this.ERROR, `${message}`, callback) },
    warn(message, callback) { this.__write__(this.WARN, `${message}`, callback) },
    fatal(message, callback) { this.__write__(this.FATAL, `${message}`, callback) }
}

LEVELS.forEach((LEVEL, index) => logger[LEVEL] = index)

if (typeof module !== 'undefined') {
    module.exports = logger
}