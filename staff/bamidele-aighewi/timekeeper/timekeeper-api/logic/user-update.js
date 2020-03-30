const { validate } = require('timekeeper-utils')
const { NotFoundError, NotAllowedError } = require('timekeeper-errors')
const { models: { User }, utils: { roles: { CLIENT, ADMINISTRATOR } } } = require('timekeeper-data')
const { validateAndReturnUpdateDatas } = require('../utils')
const bcrypt = require('bcryptjs')

module.exports = (user, props, subUserId) => {
    validate.string(user, 'id')
    validate.object(props, 'props')
    if (typeof subUserId !== 'undefined') validate.string(subUserId, 'subUserId')

    const _user = validateAndReturnUpdateDatas(props, [
        { field: 'name', type: 'string' },
        { field: 'surname', type: 'string' },
        { field: 'email', type: 'email' },
        { field: 'role', type: 'number' }, // current password
        { field: 'oldPassword', type: 'string' }, // current password
        { field: 'password', type: 'string' }, // new password
    ])

    return (async () => {
        let userSearch = await User.findOne({ _id: user })

        if (!userSearch) throw new NotFoundError(`User with id ${user} not found`)

        const { role } = _user
        const currentUserRole = userSearch.role

        if (typeof subUserId !== 'undefined' && ![CLIENT, ADMINISTRATOR].includes(role)) throw new NotAllowedError(`User with id ${user} does not have permission to update resource`)

        const { company } = userSearch

        if (typeof subUserId !== 'undefined') {
            userSearch = await User.findOne({ company, _id: subUserId })
            if (!userSearch) throw new NotFoundError(`User with id ${subUserId} not found`)
        }

        if (_user.email) {
            const { email } = _user
            const emailExist = await User.findOne({ email, _id: { $ne: userSearch.id } })
            if (emailExist) throw new NotAllowedError(`This email address ${email} already exist for another user`)
        }

        if (_user.password || _user.oldPassword) {
            if ([!!_user.password, !!_user.oldPassword].includes(false)) throw new NotAllowedError(`Both password fields must be set in order to modify current password`)
            // let's check if old password is valid
            const validPassword = await bcrypt.compare(_user.oldPassword, userSearch.password)
            if (!validPassword) throw new NotAllowedError('Can not change password')

            // let's hash new password
            _user.password = await bcrypt.hash(_user.password, 10)

            delete _user.oldPassword
        }

        if (![CLIENT, ADMINISTRATOR].includes(currentUserRole)) delete _user.role

        return userSearch.updateOne(_user).then(() => { })
    })()
}