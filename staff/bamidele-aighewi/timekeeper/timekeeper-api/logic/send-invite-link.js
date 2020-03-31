
require('dotenv').config()

const { validate } = require('timekeeper-utils')
const {
    models: { User, Company },
    utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
const { sendInviteLinkTemplate, mailer } = require('../utils')
const moment = require('moment')

const { env: { APP_NAME, APP_URL } } = process

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

        await mailer(emails, _company.name, `${sendInviteLinkTemplate({
            company_name: _company.name,
            app_url: APP_URL,
            app_name: APP_NAME,
            invite_link: `${APP_URL}/invite/${_company.invite}`,
            current_year: `${moment().format('YYYY')}`,
        })}`)
    })()
}