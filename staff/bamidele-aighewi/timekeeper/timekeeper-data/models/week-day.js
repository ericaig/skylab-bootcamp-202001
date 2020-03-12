const mongoose = require('mongoose')
const { weekDay } = require('../schemas')

module.exports = mongoose.model('WeekDay', weekDay)