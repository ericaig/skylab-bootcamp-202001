const { validate } = require('timekeeper-utils')
const { NotFoundError } = require('timekeeper-errors')
const { models: { Company, User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')

module.exports = (owner, props) => {
    validate.string(owner, 'id')

    const fieldsToChange = Object.keys(props)
    if (fieldsToChange.length === 0) throw new Error('No data received')

    const _company = {}

    const editableFields = [
        { field: 'name', type: 'string' },
        { field: 'nif', type: 'string' },
        { field: 'email', type: 'email' },
        { field: 'postalCode', type: 'string' },
        { field: 'city', type: 'string' },
        { field: 'address', type: 'string' },
        { field: 'web', type: 'url' },
        { field: 'startTime', type: 'string' },
        { field: 'endTime', type: 'string' },
    ]

    const fields = editableFields.map(({ field }) => field)

    fieldsToChange.forEach(field => {
        if (!fields.includes(field)) throw new Error(`Field ${field} is not editable`)
    })

    editableFields.forEach(({ field, type }) => {
        const value = props[field]

        if (typeof value !== 'undefined') {
            if (type === 'string')
                validate.string(value, field)
            else if (type === 'email')
                validate.email(value)
            else if (type === 'url')
                validate.url(value)

            _company[field] = value
        }
    })

    if (!Object.keys(_company)) throw new Error('No data received to modify')

    return (async () => {
        return User.findOne({ _id: owner, role: CLIENT }).lean()
            .then(user => {
                if (!user) throw new NotFoundError(`User with id ${owner} not found`)
                if (!('company' in user)) throw new NotFoundError(`User with id ${owner} is not linked to a company`)
                return user
            })
            .then(async ({ company: companyId }) => {
                const company = await Company.findOne({ _id: companyId })

                if (!company) throw new NotFoundError(`Company with id ${companyId} not found`)

                return company
            })
            .then(company =>
                company.updateOne(_company)
            )
            .then(() => { })
    })()
}