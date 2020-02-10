function Players({team, onGoToPlayerDetail}){
    const {strPlayer, strThumb} = team
    
    return <article onClick={event =>{
        event.preventDefault()
        onGoToPlayerDetail()
    }}>
        <img className="players-photo" src={`${strThumb}`}/>
        <div className="players-name">{strPlayer}</div>

    </article>
}
