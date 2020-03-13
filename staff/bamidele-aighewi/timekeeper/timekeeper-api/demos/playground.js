const { validate } = require('timekeeper-utils')
const moment = require('moment')

try {
    // console.log(new Date('Fr Mar 13 2020 12:00:11 GMT+0100 (Central European tandard Time)'))
    // validate.date("2020-03-13")
    // validate.date("13-03-2020", "DD-MM-YYYY")
    // console.log('Date is valid')

    console.log(moment('2020-03-13').isBetween("2020-03-13", '2020-03-13', null, '[]'))
} catch (error) {
    console.log(error.message)
}