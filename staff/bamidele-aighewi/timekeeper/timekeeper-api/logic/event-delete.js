const { validate } = require('timekeeper-utils')
const { models: { Company, User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')

module.exports = (owner) => {
    validate.string(owner, 'owner')

    throw new NotAllowedError(`At this moment, deleting companies is not possible. Please try again latter :) `)

    return (async () => {
        let user

        return User.findOne({ _id: owner, role: CLIENT })
            .then(_user => {
                if (!_user) throw new NotFoundError(`User with id ${owner} not found`)
                user = _user
                return _user
            })
            .then(({ company }) => 
                Company.deleteOne({ _id: company, owner })
            )
            .then(() => {
                user.company = undefined
                return user.save()
            }).then(() => { })
    })()
}