const { validate } = require('timekeeper-utils')
const { NotFoundError } = require('timekeeper-errors')
const { models: { Company, User, WeekDay }, utils: { roles: { CLIENT, ADMINISTRATOR }, sanitizer } } = require('timekeeper-data')
const { validateAndReturnUpdateDatas } = require('../utils')

module.exports = (user, props) => {
    validate.string(user, 'id')
    validate.object(props, 'props')

    const _weekDays = validateAndReturnUpdateDatas(props, [
        { field: 'monday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'tuesday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'wednesday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'thursday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'friday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'saturday', type: 'boolean', validateOpts: { acceptString: true } },
        { field: 'sunday', type: 'boolean', validateOpts: { acceptString: true } },
    ])

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to create week days`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const weekday = await WeekDay.findOne({ company })

        if (!weekday) throw new NotFoundError(`Company ${company} does not have week days created`)

        weekday.updatedAt = Date.now()
        weekday.updatedBy = _user.id

        return weekday.updateOne(_weekDays).then(() => { })
    })()
}