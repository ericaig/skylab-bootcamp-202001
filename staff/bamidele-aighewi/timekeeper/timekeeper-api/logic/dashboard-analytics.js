const { validate } = require('timekeeper-utils')
const {
    models: { WeekDay, User, Company, Event },
    utils: {
        roles: { CLIENT, ADMINISTRATOR, WORKER, DEVELOPER },
        eventStates: { PENDING, ACCEPTED },
        sanitizer,
        eventTypes: { WORK_DAY, WORK_HOLIDAY, USER_ABSENCE, USER_HOLIDAY, USER_SIGN_IN_OUT }
    }
} = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')
const moment = require('moment')

/**
 * @function
 * This retrieves company's dashboard analytics
 * @param {string} user User id
 * @param {object} props `Optional`. Filter object
 * @property {date} props.date `Optional`. Date filter
 */
module.exports = function (user, props = {}) {
    // const { date = moment().startOf('day').format('YYYY-MM-DD HH:mm') } = props
    const { date } = props

    validate.string(user, 'user')

    if (typeof date !== 'undefined') validate.date(date)// , 'YYYY-MM-DD HH:mm')

    return (async () => {
        const _user = await User.findById(user).lean()

        if (!_user) throw new NotFoundError(`User with id ${user} not found`)

        sanitizer(_user)

        const { role } = _user

        if (![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to view resources`)

        const { company } = _user

        validate.string(company.toString(), 'company')

        const _company = await Company.findById(company)//.lean()

        if (!_company) throw new NotFoundError(`Company with id ${company} not found`)

        const weekday = await WeekDay.findOne({ company }).lean()

        if (!weekday) throw new NotFoundError(`Company ${company} does not have week days created`)

        /* PENDING EVENTS */
        const totalPendingEvents = await Event.find({ company, state: PENDING }).count()

        /* ABSENCES */
        const totalAbsences = await Event.find({ company, type: USER_ABSENCE }).count()

        /* HOLIDAYS */
        const totalHolidays = await Event.find({ company, type: USER_HOLIDAY }).count()

        /* WORKERS */
        const totalWorkers = await User.find({ company, role: WORKER }).count()

        /* ACTIVITIES - TODAY */
        const users = await User.find({ company }).sort('name surname').lean()

        const signingsFindParams = { company, type: USER_SIGN_IN_OUT }
        if (typeof date !== 'undefined') {
            signingsFindParams.start = {
                "$gte": moment(date, 'YYYY-MM-DD').startOf('day').toDate(),
                "$lte": moment(date, 'YYYY-MM-DD').endOf('day').toDate()
            }
        }

        const signings = await Event.find(signingsFindParams).sort('-start -end').lean()

        const activities = users.map(userItem => {
            userItem.events = []

            signings.forEach(signing => {
                if (signing.user.toString() === userItem._id.toString()) {
                    userItem.events.push(sanitizer(signing))
                }
            })

            return sanitizer(userItem)
        })

        let inactiveUsers = 0
        activities.forEach(activity => inactiveUsers += Number(activity.events.length === 0))

        return { totalPendingEvents, totalAbsences, totalHolidays, totalWorkers, inactiveUsers, activities }

    })()
}