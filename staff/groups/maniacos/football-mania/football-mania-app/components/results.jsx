function Results({ teams, goToDetail, query, onFavClick }) {
    return <div>
        {query && <div className="search__description">
            <section className="search__query">Results for "{query}"</section>
        </div>}

        <section className="search__results products">
            {teams.map((team, index) => <Item key={index} team={team} goToDetail={goToDetail} onFavClick={onFavClick} />)}
        </section>
    </div>
}