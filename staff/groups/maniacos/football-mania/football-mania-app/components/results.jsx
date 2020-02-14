const { Fragment } = React
function Results({ teams, goToDetail, query, onFavClick }) {
    return <div style={{ boxSizing: 'border-box', flexGrow: '1' }}>
        {query && <div className="search__description">
            <section className="search__query">Results for "{query}"</section>
        </div>}

        <section className="search__results">
            {teams.map((team, index) => <Item key={index} team={team} goToDetail={goToDetail} onFavClick={onFavClick} />)}
        </section>
    </div>
}