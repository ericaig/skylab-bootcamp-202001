function PlayerDetail({player, onGoToPlayers}){
    const {strNationality, strPlayer, dateBorn, strBirthLocation, strDescriptionEN, strPosition, strThumb} = player
    debugger
    return <article className="player-detail">
        <div>
            <h2>{player[0].strPlayer}</h2>
            <h3>{player[0].strPosition}</h3>
        </div>
        {player[0].strRender && <img src={player[0].strRender}/>}
        {!player[0].strRender && <img src={player[0].strThumb}/>}
        <div>
            <p>{player[0].strNationality}</p>
            <p>{player[0].strBirthLocation}</p>
            <p>{player[0].dateBorn}</p>
        </div>
        <p>{player[0].strDescriptionEN}</p>
        <button onClick={event => {
            event.preventDefault()
            onGoToPlayers()
        }}>PLAYERS</button>
    </article>
}