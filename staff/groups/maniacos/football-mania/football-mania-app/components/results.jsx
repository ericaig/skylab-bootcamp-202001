const {Fragment} = React
function Results({ teams, goToDetail, query, onFavClick }) {
    return <Fragment>
        {query && <div className="search__description">
            <section className="search__query">Results for "{query}"</section>
        </div>}

        <section className="search__results">
            {teams.map((team, index) => <Item key={index} team={team} goToDetail={goToDetail} onFavClick={onFavClick} />)}
        </section>
    </Fragment>
}