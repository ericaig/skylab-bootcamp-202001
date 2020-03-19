const moment = require('moment')
const validate = require('./validate')
const { NotAllowedError } = require('timekeeper-errors')
// const {} = require('time')

module.exports = {
    /**
     * Check if a company works during a given day of week 
     * @param {number} dayOfWeek - Day of week 1 - Monday ..... 7 - Sunday
     * @param {object} weekDays - Week_Day schema object/collection
     */
    activeDayOfWeek(_date, weekDays, dateFormat = 'YYYY-MM-DD') {
        // if (typeof dayOfWeek !== 'number') throw new TypeError(`Day of week ${dayOfWeek} is not a number`)
        validate.date(_date, dateFormat)
        if (typeof weekDays !== 'object' || !Object.keys(weekDays).length) throw new TypeError(`Week days ${weekDays} is not an object or has no properties`)

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

        momentDate = moment(_date, dateFormat)
        const isoWeekDay = momentDate.isoWeekday()
        const textWeekDay = days[isoWeekDay - 1]
        const weekDayState = weekDays[textWeekDay]

        if (weekDayState === false) throw new NotAllowedError(`Events are not allowed for ${textWeekDay.substring(0, 1).toUpperCase().concat(textWeekDay.substring(1))}s (${momentDate.format('DD/MM/YYYY')})`)
    }
}