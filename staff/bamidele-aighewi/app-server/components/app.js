const Cookie = require('./cookie')

module.exports = function (props = {}) {
    const { title, body, req } = props

    const { cookies: { cookieConsent } } = req
    const cookieAccepted = cookieConsent && cookieConsent === 'yes'

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/style.css">
</head>
<body class="app">
    ${Cookie({ accepted: cookieAccepted })}
    ${body}
</body>
</html>`
}