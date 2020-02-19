function Leagues({leagues, goLeague}){
    return <section>
        <img src={leagues[1].strBadge} onClick={event =>{
            event.preventDefault()
            goLeague(leagues[1].idLeague, leagues[1].strCountry)}}/>
        <img src={leagues[0].strBadge} onClick={event =>{
            event.preventDefault()
            goLeague(leagues[0].idLeague, leagues[0].strCountry)}}/>
    </section>
}