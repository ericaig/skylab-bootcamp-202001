function PlayerDetail({player, onGoToPlayers}){
    const {strNationality, strPlayer, dateBorn, strBirthLocation, strDescriptionEN, strPosition, strThumb} = player
    debugger
    return <article className="player-detail">
        <div>
            <h2 className="player-detail__name">{player[0].strPlayer}</h2>
            <h3 className="player-detail__position">{player[0].strPosition}</h3>
        </div>
        {player[0].strRender && <img src={player[0].strRender}/>}
        {!player[0].strRender && <img className="player-detail__photo" src={player[0].strThumb}/>}
        <div className="player-detail__birth-container">
            <p className="player-detail__nation">{player[0].strNationality}</p>
            <p className="player-detail__birth">{player[0].strBirthLocation}</p>
            <p className="player-detail__date">{player[0].dateBorn}</p>
        </div>
        <p className="player-detail__description">{player[0].strDescriptionEN}</p>
    </article>
}