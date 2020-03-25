import { NotAllowedError } from "timekeeper-errors";
import { context } from '../logic'
export default async function (response) {
    const { status } = response

    // debugger

    if (status === 201) return

    else if (status === 200) {
        const body = await response.json()

        return body
    } else if (status >= 400 && status < 500) {
        const { error } = await response.json()

        if (status === 409) {
            throw new NotAllowedError(error)
        }else if(status === 401){
            context.clear()
            window.location.reload()
        }

        throw new Error(error)
    }

    throw new Error('server error')
}