// export default {
module.exports = {
    set token(token) {
        sessionStorage.token = token
    },

    get token() {
        return sessionStorage.token
    },

    clear() {
        delete this.token

        sessionStorage.clear()
    }
}