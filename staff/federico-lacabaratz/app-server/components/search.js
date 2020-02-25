const Feedback = require('./feedback')

module.exports = function (props = {}) {
    const { query = '', warning } = props

    return `<h2>Search</h2>
    <form action="/search/" method="GET" className="search">
    <input type="text" name="query" placeholder="criteria" value=${query}>
    <button type="submit">Search</button>  
    ${warning ? Feedback({ level: 'warning', message: warning }) : ''}
    </form>`
}
