const { validate } = require('timekeeper-utils')
const { models: { Company, User }, utils: { sanitizer } } = require('timekeeper-data')
const { NotFoundError } = require('timekeeper-errors')

module.exports = user => {
    validate.string(user, 'owner')

    return (async () => {
        let _user = await User.findById(user)

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        // sanitizer(_user)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)
            .populate({
                path: 'owner',
                select: 'name surname email'
            })
            .lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        sanitizer(_company.owner)
        return sanitizer(_company)
    })()
}