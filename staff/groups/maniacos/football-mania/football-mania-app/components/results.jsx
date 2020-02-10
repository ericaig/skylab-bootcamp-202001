function Results() {
    return <div>
        <div className="search__description">
            <section className="search__query">Results for "Barcelona"</section>
            <section className="search__filterModifier">
                <i className="fas fa-filter"></i>
            </section>
        </div>
        
        <section className="search__results products">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value, index) => <Item key={index} />)}
        </section>
    </div>
}