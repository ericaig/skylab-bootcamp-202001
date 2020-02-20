
function bodyParse(req, res, next) {
    let data = ''
    req.on('data', chunk => data += chunk)
    req.on('end', () => {
        const body = {}

        data.split('&').forEach(item => {
            const [key, value] = item.split('=')
            body[key] = value
        })

        req.body = body

        next()
    })
}

module.exports = bodyParse