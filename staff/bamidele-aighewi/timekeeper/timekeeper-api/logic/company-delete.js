const { validate } = require('timekeeper-utils')
const { models: { Company, User } } = require('timekeeper-data')

module.exports = (owner) => {
    validate.string(owner, 'owner')

    return (async () => {
        const user = await User.findById(owner)
        const { company } = user

        return Company.deleteOne({ _id: company, owner })
            .then(() => {
                user.company = undefined
                return user.save()
            }).then(() => { })
    })()
}