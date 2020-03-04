export default class NotAllowedError extends Error {
    constructor(...args) {
        super(...args)

        this.name = NotAllowedError.name
    }
}