module.exports = class EmptyValueError extends Error {
    //constructor(message, fileName, lineNumber) {
    constructor(...args) {
        //super(message, fileName, lineNumber)
        super(...args)

        this.name = EmptyValueError.name
    }
}