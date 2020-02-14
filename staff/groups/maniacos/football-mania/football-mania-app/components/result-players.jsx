function Resultplayers({ players, onClickPlayer, onToResults, detail }) {
    const { strAlternate } = detail

    return <div>
        <Breadcrumb items={[{ title: 'Results', breadcrumbClick: onToResults }, { title: strAlternate, breadcrumbClick: undefined }]} />
        <section className="players">
            {players.map((team, index) => <Players key={index} team={team} onClickPlayer={onClickPlayer} />)}
        </section>
    </div>
}
