function Players({team, onClickPlayer, onToResults}){
    const {strPlayer, strThumb, strTeam} = team
    
    return <article>
        <img className="players-photo" src={`${strThumb}`} onClick={event =>{
            event.preventDefault()
            onClickPlayer(strTeam, strPlayer)
        }}/>
        <div className="players-name">{strPlayer}</div>
        <button onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>RESULTS</button>
    </article>
}
