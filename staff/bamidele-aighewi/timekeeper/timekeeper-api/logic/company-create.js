const { validate } = require('timekeeper-utils')
const { models: { Company, User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { NotAllowedError } = require('timekeeper-errors')
const { v4: uuid } = require('uuid')

module.exports = function (name, email, address, owner, web, cif, city, postalCode, startTime, endTime) {
    validate.string(name, 'name')
    validate.email(email)
    validate.string(address, 'address')
    validate.string(owner, 'owner')
    validate.url(web)
    validate.string(cif, 'cif')
    validate.cif(cif, 'cif')
    validate.string(city, 'city')
    validate.string(postalCode, 'postalCode')
    validate.string(startTime, 'startTime')
    validate.string(endTime, 'endTime')

    email = email.toLowerCase()

    return (async () => {
        const user = await User.findOne({ _id: owner })
        if (!user) throw new Error(`Client with id ${owner} doesn't exist`)
        if (CLIENT !== user.role) throw new NotAllowedError(`User with id ${owner} does not have permission to create a company`)
        if (user.company) throw new Error(`Client with id ${owner} already has a company created`)

        const _company = new Company({
            name,
            email,
            address,
            owner,
            web,
            cif,
            city,
            postalCode,
            startTime,
            endTime,
            created: new Date
        })

        _company.invite = uuid()

        const { _id: company } = await _company.save()

        user.company = company
        return user.save().then(() => { })
    })()
}