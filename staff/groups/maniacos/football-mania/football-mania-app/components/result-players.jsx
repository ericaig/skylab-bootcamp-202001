function Resultplayers({players, onClickPlayer, onToResults}) {
    return <div>
        <section className="players">
            {players.map((team, index) => <Players key={index} team={team} onClickPlayer={onClickPlayer} onToResults={onToResults}/>)}
        </section>
    </div>
}
