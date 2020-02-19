const http = require('http')

function ipGeolocation(ip, callback){
    http.get(`http://api.ipstack.com/${ip}?access_key=3d9ebc5fefa0bf44d6abf75111f21a8b`, (res) => {
        res.setEncoding('utf8')
        let rawData = ''
        res.on('data', (chunk) => { rawData += chunk })
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData)
                callback(undefined, parsedData)
            } catch (e) {
                callback(e)
            }
        })
    })
}

if(typeof module !== 'undefined') module.exports = ipGeolocation