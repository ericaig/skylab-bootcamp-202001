import { validate } from 'events-utils'
const API_URL = process.env.REACT_APP_API_URL

export default function (id) {
    validate.string(id, 'id')

    return (() => {

    })()
}