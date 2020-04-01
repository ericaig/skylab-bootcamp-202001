const { validate } = require('timekeeper-utils')

module.exports = function (name, cif, email, web, address, city, postalCode){
    validate.string(name, 'name')
    validate.cif(cif, 'cif')
    validate.email(email)
    validate.url(web)
    validate.string(address, 'address')
    validate.string(city, 'city')
    validate.string(postalCode, 'postalCode')
}