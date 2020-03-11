const { validate } = require('timekeeper-utils')
const { models: { User } } = require('timekeeper-data')
const { NotAllowedError, NotFoundError } = require('timekeeper-errors')

module.exports = id => {
    validate.string(id, 'id')

    return User.findById(id)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${id} does not exist`)

            if (user.deactivated) throw new NotAllowedError(`user with id ${id} is deactivated`)

            user.retrieved = new Date

            return user.save()
        })
        .then(({ name, surname, email, company }) => ({ name, surname, email, company }))
}