const net = require('net')
const fs = require('fs')
const logger = require('./utils/logger')
const config = require('./utils/app-config')

config.debugger = true
logger.debug('Starting server')

const server = net.createServer(socket => {
    socket.on('data', chunk => {
        logger.host = socket.remoteAddress
        
        logger.info('Server received data')

        const [methodFile] = chunk.toString().split('\n')
        let [, file] = methodFile.split(' ')
        file = `./public${file.replace('/', '')}`

        const endSocket = (status, statusMessage, html = '') =>{
            logger.debug('Shutting down server')
            socket.end(`HTTP/1.1 ${status} ${statusMessage}\nServer: Cowboy\nAccess-Control-Allow-Origin: *\nContent-Type: text/html\n\n${html}\n`) // Content-Type: text/html
        }

        // let html = ''
        // fs.createReadStream('../23/index.html')
        // console.log(fs)
        // fs.on('data', chunk => html += chunk.toString())
        // fs.on('end', () => endSocket('200', 'OK', html))
        // fs.on('error', error => endSocket('404', 'Not Found', error.message))

        // endSocket('404', 'Not Found', 'error.message')
        
        fs.readFile(file, (error, data) => {
            if (error) {
                logger.error(error.message)
                endSocket('404', 'Not Found', `<h1>${error.message}</h1>`)
                return
            }

            logger.info('User visited ' + file)
            endSocket('200', 'OK', data.toString())
        })
    })
})

server.listen(8080)