function TablePosition({table, detail, teams}){

    const {name, teamid, played, goalsfor, goalsagainst, goalsdifference, win, draw, loss, total } = table
    const {idTeam} = detail

    const teamDetail = teams.find(item=>{
        return item.idTeam === teamid
    })

    return <li className={`table${teamid === idTeam ? ' chosen' : ''}`}>
        {teamDetail && <img className="table__badge" src={teamDetail.strTeamBadge} style={{width: '30px'}} />}
        <div className="table__name-section">
            <h3 className="table__name">{name}</h3>
        </div>
        <section className="table__numbers">
            <span className="table__played">{played}</span>
            <span className="table__win">{win}</span>
            <span className="table__draw">{draw}</span>
            <span className="table__loss">{loss}</span>
            <span className="table__goalsfor">{goalsfor}</span>
            <span className="table__goalsagainst">{goalsagainst}</span>
            <span className="table__goalsdifference">{goalsdifference}</span>
            <span className="table__total">{total}</span>
        </section>
    </li>
}