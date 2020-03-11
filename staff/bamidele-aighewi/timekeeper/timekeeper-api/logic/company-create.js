const { validate } = require('timekeeper-utils')
const { models: { Company, User } } = require('timekeeper-data')
const {v4: uuid} = require('uuid')

module.exports = function (name, email, address, owner, web, nif, city, postalCode, startTime, endTime) {
    validate.string(name)
    validate.email(email)
    validate.string(address)
    validate.string(owner)
    validate.url(web)
    validate.string(nif)
    validate.string(city)
    validate.string(postalCode)
    validate.string(startTime)
    validate.string(endTime)

    email = email.toLowerCase()

    return (async () => {
        const user = await User.findOne({ _id: owner })
        if (!user) throw new Error(`Client with id ${owner} doesn't exist`)
        if (user.company) throw new Error(`Client with id ${owner} already has a company created`)

        const _company = new Company({
            name,
            email,
            address,
            owner,
            web,
            nif,
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