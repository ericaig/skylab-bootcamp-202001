import context from './context'
import { serverResponse } from '../utils'
const { validate } = require('timekeeper-utils')

const API_URL = process.env.REACT_APP_API_URL

/**
 * @function
 * To update company's week days
 * @param {string} user User id
 * @param {boolean} monday To configure this day as working day or not
 * @param {boolean} tuesday To configure this day as working day or
 * @param {boolean} wednesday To configure this day as working day or not
 * @param {boolean} thursday To configure this day as working day or not
 * @param {boolean} friday To configure this day as working day or not
 * @param {boolean} saturday To configure this day as working day or not
 * @param {boolean} sunday To configure this day as working day or not
 */
export default (function (monday, tuesday, wednesday, thursday, friday, saturday, sunday) {
    validate.boolean(monday, 'monday')
    validate.boolean(tuesday, 'tuesday')
    validate.boolean(wednesday, 'wednesday')
    validate.boolean(thursday, 'thursday')
    validate.boolean(friday, 'friday')
    validate.boolean(saturday, 'saturday')
    validate.boolean(sunday, 'sunday')

    return (async () => {
        const response = await fetch(`${API_URL}/week-days`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.token}`
            },
            body: JSON.stringify({ monday, tuesday, wednesday, thursday, friday, saturday, sunday }),
        })

        return await serverResponse(response)
    })()
}).bind(context)