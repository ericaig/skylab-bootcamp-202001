function Results({ teams, goToDetail, query }) {
    return <div>
        {query && <div className="search__description">
            <section className="search__query">Results for "{query}"</section>
        </div>}

        <section className="search__results products">
            {teams.map((team, index) => <Item key={index} team={team} goToDetail={goToDetail} />)}
        </section>
    </div>
}