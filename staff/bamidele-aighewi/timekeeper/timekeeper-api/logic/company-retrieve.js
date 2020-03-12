const { validate } = require('timekeeper-utils')
const { models: { Company }, utils: { sanitizer } } = require('timekeeper-data')
const { NotFoundError } = require('timekeeper-errors')

module.exports = owner => {
    validate.string(owner, 'owner')

    return (async () => {
        const company = await Company.findOne({ owner })
            .populate({
                path: 'owner',
                select: 'name surname email -_id'
            })
            .lean()

        if (!company) throw new NotFoundError(`Company with owner id ${owner} does not exist`)

        sanitizer(company)

        return company
    })()
}