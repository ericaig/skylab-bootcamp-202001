function Leagues({league, goLeague}){
    debugger
    //const {strBadge, idLeague} = leagues
    return <section>
        <img src={league[1].strBadge} onClick={event =>{
            event.preventDefault()
            goLeague(idLeague)}}/>
        <img src={league[0].strBadge} onClick={event =>{
            event.preventDefault()
            goLeague(idLeague)}}/>
    </section>
}