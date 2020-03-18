import { NotAllowedError } from "timekeeper-errors";
export default async function(response){
    const { status } = response

    // debugger

    if (status === 201) return

    else if (status === 200) {
        const body = await response.json()

        return body
    }else if (status >= 400 && status < 500) {
        const { error } = await response.json()

        if (status === 409) {
            throw new NotAllowedError(error)
        }

        throw new Error(error)
    }

    throw new Error('server error')
}