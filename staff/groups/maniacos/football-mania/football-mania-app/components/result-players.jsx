function Resultplayers({players, onClickPlayer, onToResults}) {
    return <div>
        <a href="" onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>Go back to Results</a>
        <section className="players">
            {players.map((team, index) => <Players key={index} team={team} onClickPlayer={onClickPlayer}/>)}
        </section>
    </div>
}
