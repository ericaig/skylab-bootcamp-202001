function Resultplayers({player, onGoToPlayerDetail}) {
    //debugger
    return <div>
        <section className="players">
            {player.map((team, index) => <Players key={index} team={team} onGoToPlayerDetail={onGoToPlayerDetail} />)}
        </section>
    </div>
}
