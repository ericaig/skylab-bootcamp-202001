const Search = require('./search')
const User = require('./user')
const Results = require('./results')

module.exports = function (props = {}) {
    const { name, username, query, results } = props

    return `${name ? User({ name, username }) && `<form action="/logout" method="POST"><button>Logout</button></form>` : `<a href="/register">Register</a> or <a href="/login">Login</a>`}
    ${name ? User({ name, username}) && `<form action="/favourites/${name} method="GET"><button type="submit">To my Favs ⭐️</button></form>` : ''}
    ${Search({ query })}
    ${results ? Results({ results }) : ''}`
}