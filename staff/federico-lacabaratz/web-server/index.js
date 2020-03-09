const express = require('express')
const logger = require('./utils/logger')
const path = require('path')
const loggerMidWare = require('./utils/logger-mid-ware')
// const staticMidWare = require('./utils/static-mid-ware')

const { argv: [, , port = 8080] } = process

logger.level = logger.DEBUG
logger.path = path.join(__dirname, 'server.log')

logger.debug('setting up server')

const app = express()

app.use(loggerMidWare)

//app.use(staticMidWare(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () => logger.info(`server up and running on port ${port}`))

process.on('SIGINT', () => {
    logger.warn(`server abruptly stopped`)

    process.exit(0)
})


// const server = http.createServer((request, response) => {
//     const { method, url, headers, httpVersion, socket } = request

//     const rawRequest = `${method} ${url} HTTP/${httpVersion}
// ${Object.keys(headers).reduce((accum, header) => accum += `${header}: ${headers[header]}\n`, '')}`

//     logger.info(`request from ${socket.remoteAddress}:
// ${rawRequest}`)

//     let _path = url

//     if (_path === '/') _path += 'index.html'

//     _path = `./public${_path}`

//     const rs = fs.createReadStream(_path)

//     let extension = path.extname(_path).substring(1)

//     extension = extension === 'js'? 'javascript' : extension

//     response.setHeader('Content-Type', `text/${extension}`)

//     rs.pipe(response)

//     rs.on('error', error => {
//         logger.warn(error)

//         response.writeHead(404)

//         return response.end(`<h1>Not found</h1>`)
//     })

//     response.on('error', error => logger.error(error))
// })


// const http = require('http')
// const logger = require('./utils/logger')
// const fs = require('fs')
// const path = require('path')

// const { argv: [, , port = 8080] } = process

// logger.setDebugEnabled(true)
// logger.setLogFile(path.join(__dirname, 'server.log'))

// logger.debug('starting server')

// const server = http.createServer((req, res) => {
//     const {method, url, headers, httpVersion, socket} = req
//     const rawRequest = `${method} ${url} HTTP/${httpVersion}
// ${Object.keys(headers).reduce((accum, header) => accum += `${header}: ${headers[header]}\n`, '')}`
    
//     logger.info(`request from ${socket.remoteAddress}:
// ${rawRequest}`)

//     const main = '/index.html'

//     const rs = fs.createReadStream(`.${req.url === '/' ? main : req.url}`)
    
//     res.setHeader('Content-Type', 'text/html')

//     if (req.url !== 'favicon.ico') {
//         rs.on('data', body => {
//             logger.info('correct reading')
//             res.write(body)
//         })

//         rs.on('end', () => {
//             logger.info('end of the chunk')
//             res.end()
//         })

//         rs.on('error', error => {
//             logger.warn(error)
//             res.writeHead(404)
//             res.end('<h1>NOT FOUND<h1>')
//         })
//     } else {
//         logger.warn(error)
//         res.writeHead(404)
//         res.end('<h1>NOT FOUND<h1>')
//     }
// })

// server.listen(port, () => logger.info(`server up and running on port ${port}`))

// process.on('SIGINT', () => {
//     logger.warn(`server abruptly stopped`)

//     setTimeout(() => process.exit(0), 1000)
// })
