const { validate } = require('timekeeper-utils')
const { models: { User, Company, WeekDay }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { NotAllowedError } = require('timekeeper-errors')
const bcrypt = require('bcryptjs')
const { v4: uuid } = require('uuid')

module.exports = (_client, _company) => {
    let { name, surname, email, password } = _client
    let { name: companyName, email: companyEmail, address, web, cif, city, postalCode, startTime = '08:00', endTime = '17:00' } = _company

    // client
    validate.string(name, 'Name')
    validate.string(surname, 'Surname')
    validate.string(email, 'Email')
    validate.email(email)
    validate.string(password, 'Password')

    // company
    validate.string(companyName, 'Company name')
    validate.email(companyEmail)
    validate.string(address, 'Address')
    validate.url(web)
    validate.string(cif, 'Cif')
    validate.cif(cif, 'Cif')
    validate.string(city, 'City')
    validate.string(postalCode, 'Postal code')
    validate.string(startTime, 'Start time')
    validate.string(endTime, 'End time')

    email = email.toLowerCase()
    companyEmail = companyEmail.toLowerCase()
    const role = CLIENT

    return User.findOne({ email })
        .then(user => {
            if (user) throw new NotAllowedError(`user with email ${email} already exists`)

            return bcrypt.hash(password, 10)
        })
        .then(password => {
            const user = new User({ name, surname, email, password, role, created: new Date })

            return user.save()
        })
        .then(user => {
            const company = new Company({
                name: companyName,
                email: companyEmail,
                address,
                owner: user.id,
                web,
                cif,
                city,
                postalCode,
                startTime,
                endTime,
                created: new Date
            })

            company.invite = uuid()

            return company.save()
                .then(({ id }) => {
                    user.company = id

                    return user.save()
                }).then(()=>{
                    const weekday = new WeekDay({ company: company.id, monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false, createdBy: user.id, updatedBy: user.id })

                    return weekday.save()
                })
        })
        .then(() => { })

}