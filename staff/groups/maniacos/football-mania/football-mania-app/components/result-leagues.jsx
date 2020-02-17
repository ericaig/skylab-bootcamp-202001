function ResultLeagues({leagues, goLeague}){
    return <section>
        {leagues.map((league, index) => <Leagues key={index} league={league} goLeague={goLeague}/>)}
    </section>
}