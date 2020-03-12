const { validate } = require('timekeeper-utils')

module.exports = function (props, editableFields) {
    const _fieldsToUpdate = {}

    const fieldsToChange = Object.keys(props)
    if (fieldsToChange.length === 0) throw new Error('No data received')

    const fields = editableFields.map(({ field }) => field)

    fieldsToChange.forEach(field => {
        if (!fields.includes(field)) throw new Error(`Field ${field} is not editable`)
    })

    editableFields.forEach(({ field, type, validateOpts = {} }) => {
        const value = props[field]

        if (typeof value !== 'undefined') {
            if (type === 'string')
                validate.string(value, field)
            else if (type === 'email')
                validate.email(value)
            else if (type === 'url')
                validate.url(value)
            else if (type === 'boolean') {
                const { acceptString } = validateOpts
                if (!!acceptString) validate.string(value, field)
                else validate.boolean(value, field)
            }

            _fieldsToUpdate[field] = value
        }
    })

    if (!Object.keys(_fieldsToUpdate)) throw new Error('No data received to modify')

    return _fieldsToUpdate
}