module.exports = function ({ name, username, query = 'gold' }) {
    /*const { name, username } = props

    return `<section>
<h1>Welcome, ${name}!</h1><form action="/logout" method="POST"><input type="hidden" value="${username}" name="username"><button>Logout</button></form>
</section>`*/

    return `
    <h1>Karmazon App</h1>
    <h2>
        ${name} 
        <form action="/logout" method="POST">
            <button>Logout</button>
        </form>
    </h2>
    <form class="search" action="/search/${username}" method="GET">
        <h2>Search</h2>
        <input type="text" name="query" placeholder="criteria" value="${query}" />
        <button type="submit">Search</button>

        <!--{ warning && <Feedback level="warning" message={warning} />}-->
    </form>`
}