const Results = require('./results')

module.exports = function (props = {}) {
    const { error, query, name, vehicles } = props

    return `<section class="section">
    <h2>Search</h2>
    <p>User: ${name} is logged in</p>
    <form action="/search/" method="GET" className="search">
    <input type="text" name="query" placeholder="criteria" defaultValue=${query}/>
    <button type="submit">Search</button>
    
    ${error ? `<p class="search__error">${error}</p>` : ''}
    ${vehicles ? `<p>${Results({vehicles})}</p>` : ''}
    </form>
    <form action="/logout" method="POST"><button>Logout</button></form>
    </section>`

}
