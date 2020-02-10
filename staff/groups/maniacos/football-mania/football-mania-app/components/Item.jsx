function Item({ team: { idTeam, strStadium, strAlternate, strTeamBadge }, goToDetail }) {
    const itemMedia = {
        backgroundImage: 'url(' + strTeamBadge + ')',
    };

    return <article className="search__item item" onClick={()=>{
        goToDetail(idTeam)
    }}>
        <div className="item__media" style={itemMedia}></div>
        <div className="item__details">
            {/*<div className="item__notAvailable item__notAvailable-visible">itemo agotado</div>*/}
            <div className="item__description">{strAlternate}</div>
            <div className="item__subDescription item__subDescription-secondary">{strStadium}</div>
        </div>
    </article>
}