const { validate } = require('timekeeper-utils')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')
const { models: { User } } = require('timekeeper-data')
const { validateAndReturnUpdateDatas } = require('../utils')
const bcrypt = require('bcryptjs')

module.exports = (user, props) => {
    validate.string(user, 'id')
    validate.object(props, 'props')

    const _user = validateAndReturnUpdateDatas(props, [
        { field: 'name', type: 'string' },
        { field: 'surname', type: 'string' },
        { field: 'email', type: 'email' },
        { field: 'oldPassword', type: 'string' }, // current password
        { field: 'password', type: 'string' }, // new password
    ])

    return (async () => {
        const userSearch = await User.findOne({ _id: user })

        if (!userSearch) throw new NotFoundError(`User with id ${user} not found`)

        if (_user.email) {
            const { email } = _user
            const emailExist = await User.findOne({ email, _id: { $ne: user } })
            debugger
            if (emailExist) throw new NotAllowedError(`This email address ${email} already exist for another user`)
        }

        if (_user.password && _user.oldPassword) {
            // let's check if old password is valid
            const validPassword = await bcrypt.compare(_user.oldPassword, userSearch.password)
            if (!validPassword) throw new NotAllowedError('Can not change password')

            // let's hash new password
            _user.password = await bcrypt.hash(_user.password, 10)

            delete _user.oldPassword
        }

        return userSearch.updateOne(_user).then(() => { })
    })()
}