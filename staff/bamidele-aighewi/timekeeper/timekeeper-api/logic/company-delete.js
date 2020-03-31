const { validate } = require('timekeeper-utils')
const { models: { Company, User }, utils: { roles: { CLIENT } } } = require('timekeeper-data')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')
/**
 * @function
 * This deletes a company from db
 * @param  {string} owner
 */
module.exports = (owner) => {
    validate.string(owner, 'owner')

    // throw new NotAllowedError(`At this moment, deleting companies is not possible. Please try again latter :) `)

    return (async () => {
        let user

        return User.findOne({ _id: owner, role: CLIENT })
            .then(_user => {
                if (!_user) throw new NotFoundError(`User with id ${owner} not found`)
                user = _user
                return _user
            })
            .then(user => {
                return Company.deleteOne({ _id: user.company, owner: user._id })
            })
            .then(() => {
                user.company = undefined
                return user.save()
            }).then(() => { })
    })()
}