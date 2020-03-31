require('dotenv').config()
const nodemailer = require('nodemailer')

const { env: { SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT, SMTP_HOST, SMTP_FROM_NAME, SMTP_FROM_MAIL, APP_NAME, APP_URL } } = process

module.exports = function (emails, subject, html) {
    if(typeof emails === 'string') emails = [emails]

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: { user: SMTP_USERNAME, pass: SMTP_PASSWORD }
    });

    // send mail with defined transport object
    return transporter.sendMail({
        from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_MAIL}>`, // sender address
        to: emails.join(', '), // list of receivers
        subject, // Subject line
        html // html body
    }).then(() => { })
}