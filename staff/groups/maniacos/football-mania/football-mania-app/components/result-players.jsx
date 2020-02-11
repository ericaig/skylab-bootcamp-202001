function Resultplayers({players, onClickPlayer, onToResults}) {
    return <div>
        <button onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>RESULTS</button>
        <section className="players">
            {players.map((team, index) => <Players key={index} team={team} onClickPlayer={onClickPlayer}/>)}
        </section>
    </div>
}
