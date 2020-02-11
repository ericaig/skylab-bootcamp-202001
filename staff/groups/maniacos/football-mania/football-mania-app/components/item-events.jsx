function ItemEvents ({item: {strEvent, strLeague, strDate, strTime, intHomeScore, intAwayScore}}) {
    return <section>
     
        <p className="events">{strEvent}</p>
        <p className="events">{strLeague}</p>
        <p className="events">{strDate}</p>
        <p className="events">{strTime}</p>
        <p className="events">{intHomeScore}</p>
        <p className="events">{intAwayScore}</p>
        
    </section>
}