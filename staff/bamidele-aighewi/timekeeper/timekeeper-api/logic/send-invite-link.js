require('dotenv').config()

const nodemailer = require('nodemailer')
const { validate } = require('timekeeper-utils')
const {
    models: { User, Company },
    utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
const { sendInviteLinkTemplate} = require('../utils')
const { env: { SMTP_USERNAME, SMTP_PASSWORD, SMTP_PORT, SMTP_HOST, SMTP_FROM_NAME, SMTP_FROM_MAIL, APP_NAME, APP_URL } } = process
const moment = require('moment')

/**
 * @function
 * This sends invite link to the emails received
 * @param {string} user - User id
 * @param {array} emails - List of valid emails
 */
module.exports = function (user, emails) {
    validate.string(user, 'user')
    validate.type(emails, 'emails', Array)
    emails.forEach(email => validate.email(email))

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to perform this action`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: { user: SMTP_USERNAME, pass: SMTP_PASSWORD }
        });

        // send mail with defined transport object
        await transporter.sendMail({
            from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_MAIL}>`, // sender address
            to: emails.join(', '), // list of receivers
            subject: `${_company.name}`, // Subject line
            html: `${sendInviteLinkTemplate({
                company_name: _company.name,
                app_url: APP_URL,
                app_name: APP_NAME,
                invite_link: `${APP_URL}/invite/${_company.invite}`,
                current_year: `${moment().format('YYYY')}`,
            })}` // html body
        })
    })()
}