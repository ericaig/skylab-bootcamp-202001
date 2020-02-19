const axios = require('axios')
const http = require('http')
const fs = require('fs')
const logger = require('./logger')
const config = require('./app-config')
const ipGeolocation = require('./ip-geolocation')

config.debugger = true
logger.debug('Starting server')

const server = http.createServer((req, res) => {
    const { socket } = req

    const ipAddress = socket.remoteAddress.split(':')[3]

    logger.host = ipAddress

    logger.debug('Instantiating socket data listener')

    // res.write(`${Object.keys(socket).join('\n')}`)

    let { url: path } = req

    if(path.includes('favicon')){
        res.end()
        return
    }

    if(path === '/') path = '/index.html'

    if(!path.includes('.html')) path = `${path}.html`

    path = `.${path}`

    logger.debug('RECEIVED DATA')


    logger.debug("Detect client's requested page")
    // const humanReadableData = chunk.toString()
    // let [, path] = humanReadableData.split('\n')[0].split(' ')

    // if (path === '/') path = '/index.html'
    // path = `.${path}`

    logger.debug(`Detected client's requested page: ${path}`)

    const endSocket = (status, html = '') => {
        logger.debug('Shutting down server')
        // socket.end(`HTTP/1.1 ${status} ${statusMessage}\nServer: Cowboy\nAccess-Control-Allow-Origin: *\nContent-Type: text/html\n\n${html}\n`) // Content-Type: text/html

        // socket.writeHead(status, { 'Content-Type': 'text/html' })
        // socket.write('OK')
        // socket.end('OK')
        res.writeHead(status, { 'Content-Type': 'text/html' });
        res.write(html);
        res.end();
    }

    logger.debug(`Attempting to read file ${path}`)

    fs.readFile(path, (error, fileData) => {
        if (error) {
            logger.error(error.message)
            endSocket('404', `<h1>${error.message}</h1>`)
            return
        }

        axios.get('https://api6.ipify.org/?format=json')
        .then(data => data.data.ip)
        .then(routerIp=>{
            ipGeolocation(routerIp, (error, ipData) => {
                if (error) {
                    logger.error(`Could not geolocalize ${ipAddress}`)
                    endSocket('200', fileData.toString())
                    return
                }

                logger.info(`Geolocalized ${ipAddress}: ${ipData.region_name} | ${ipData.city} | ${ipData.country_name}`)
                endSocket('200', fileData.toString())
            })
        })
        .catch(()=>{
            logger.error(`Could not get router ip`)
            endSocket('200', fileData.toString())
        })

    })

    // false && socket.on('data', (chunk) => {})


    //res.end()
})

server.listen(8080)

server.on('error', (error) => logger.error(error.message))
// server.on('connection', (socket)=> {})