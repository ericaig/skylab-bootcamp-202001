function Item({ team, goToDetail, onFavClick }) {
    const { idTeam, strStadium, strAlternate, strTeamBadge, isFavorited } = team

    const itemMedia = {
        backgroundImage: 'url(' + strTeamBadge + ')',
    };

    return <article className="search__item item" onClick={()=>{ goToDetail(team) }}>
        <div className={`item__favBtn${isFavorited ? ' active' : ''}`} title="Add to favorite" onClickCapture={event => {
            event.stopPropagation()

            onFavClick(idTeam)
        }}><i className="fas fa-futbol"></i></div>
        <div className="item__media" style={itemMedia}></div>
        <div className="item__details">
            {/*<div className="item__notAvailable item__notAvailable-visible">itemo agotado</div>*/}
            <div className="item__description">{strAlternate}</div>
            <div className="item__subDescription item__subDescription-secondary">{strStadium}</div>
        </div>
    </article>
}