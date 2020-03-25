export default {
    set token(token) {
        sessionStorage.token = token
    },

    get token() {
        return sessionStorage.token
    },

    set theme(theme) {
        sessionStorage.theme = theme
    },

    get theme() {
        return sessionStorage.theme
    },

    clear() {
        // delete this.token

        sessionStorage.clear()
    }
}