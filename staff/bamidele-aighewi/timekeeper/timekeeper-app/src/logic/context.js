let _user = {}
let _company = {}

export default {
    set token(token) {
        // sessionStorage.token = token
        localStorage.token = token
    },

    get token() {
        // return sessionStorage.token
        return localStorage.token
    },

    set theme(theme) {
        // sessionStorage.theme = theme
        localStorage.theme = theme
    },

    get theme() {
        // return sessionStorage.theme
        return localStorage.theme
    },

    set user(user) {
        _user = user
    },

    get user() {
        return _user
    },

    set company(company) {
        _company = company
    },

    get company() {
        return _company
    },

    clear() {
        // delete this.token

        _user = {}
        _company = {}
        sessionStorage.clear()
        localStorage.clear()
    }
}