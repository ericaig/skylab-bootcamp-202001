const mongoose = require('mongoose')
const { company } = require('../schemas')

module.exports = mongoose.model('Company', company)