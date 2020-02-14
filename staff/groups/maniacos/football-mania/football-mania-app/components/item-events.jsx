function ItemEvents({ item }) {
    const { strHomeTeam, strAwayTeam, dateEvent, strLeague, strDate, strTime, intHomeScore, intAwayScore, homeTeamDetail, awayTeamDetail } = item
    //console.log('away', item,awayTeamDetail)
    const date = dateEvent && strTime && new Date(`${dateEvent} ${strTime}`)
    let dateFormatted = ''
    
    if(date){
        dateFormatted = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
    }

    return <section className="event__item">
        <div className="event__date">
            <span>{dateFormatted}</span>
        </div>
        <div className="event__info">
            <div className="event__home">
                {homeTeamDetail ?
                    <div className="event__badge" style={{ backgroundImage: `url(${homeTeamDetail.strTeamBadge})`}}></div> :
                    <div className="event__badge" style={{ backgroundImage: 'url("./images/football-swoosh.png")' }}></div>
                }
                {strHomeTeam}
            </div>
            <div className="event__separator">vs</div>
            <div className="event__away">
                {awayTeamDetail ?
                    <div className="event__badge" style={{ backgroundImage: `url(${awayTeamDetail.strTeamBadge})` }}></div> :
                    <div className="event__badge" style={{ backgroundImage: 'url("./images/football-swoosh.png")' }}></div>
                }
                {strAwayTeam}
            </div>
        </div>

        {intHomeScore && intAwayScore && <hr className="faded-sides"/>}

        <div className="event__scores">
            <div className={`event__score${intHomeScore < intAwayScore ? ' loser' : ''}`}>{intHomeScore}</div>
            <div className={`event__score${intHomeScore < intAwayScore ? '' : ' loser'}`}>{intAwayScore}</div>
        </div>
    </section>
}