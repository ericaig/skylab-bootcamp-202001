function Players({team, onClickPlayer}){
    const {strPlayer, strThumb, strTeam} = team
    
    return <article>
        <img className="players-photo" src={`${strThumb}`} onClick={event =>{
            event.preventDefault()
            onClickPlayer(strTeam, strPlayer)
        }}/>
        <div className="players-name">{strPlayer}</div>
        
    </article>
}
