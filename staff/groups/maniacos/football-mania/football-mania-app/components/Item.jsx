function Item({ team, goToDetail }) {
    const { idTeam, strStadium, strAlternate, strTeamBadge } = team

    const itemMedia = {
        backgroundImage: 'url(' + strTeamBadge + ')',
    };

    return <article className="search__item item" onClick={()=>{
        goToDetail(team)
    }}>
        <div className="item__media" style={itemMedia}></div>
        <div className="item__details">
            {/*<div className="item__notAvailable item__notAvailable-visible">itemo agotado</div>*/}
            <div className="item__description">{strAlternate}</div>
            <div className="item__subDescription item__subDescription-secondary">{strStadium}</div>
        </div>
    </article>
}