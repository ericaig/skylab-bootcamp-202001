const mongoose = require('mongoose')
const modelInstanceSanitizer = require('./utils/sanitize-model-instance')

module.exports = {
    models: require('./models'),
    sanitizer: modelInstanceSanitizer,
    mongoose
}