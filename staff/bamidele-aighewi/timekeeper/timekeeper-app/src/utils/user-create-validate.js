const { validate } = require('timekeeper-utils')

module.exports = function(name, surname, email, password){
    validate.string(name, 'Name')
    validate.string(surname, 'Surname')
    validate.string(email, 'E-mail')
    validate.email(email)
    validate.string(password, 'Password')
}