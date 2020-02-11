function FavoriteItem({ team, goToDetail }) {
    const { strAlternate, strTeamBadge } = team

    return <li className="favorite__item" onClick={()=>{
        goToDetail(team) 
    }}>
        <div className="favorite__logo"><img src={strTeamBadge} /></div>
        <div className="favorite__name">{strAlternate}</div>
    </li>
}