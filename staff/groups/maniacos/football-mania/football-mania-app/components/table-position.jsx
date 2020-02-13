function TablePosition({table}){
    const {name, teamid, played, goalsfor, goalsagainst, goalsdifference, win, draw, loss, total } = table
    return <li className="table">
        <h3 className="table__name">{name}</h3>
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