function ResultTable({table, onToResults, detail, teams}){
    const { strAlternate } = detail
    
    return <ul className="table__container">
        {/* <a href="" onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>Go back to Results</a> */}

        <Breadcrumb items={[{ title: 'Results', breadcrumbClick: onToResults }, { title: strAlternate, breadcrumbClick: undefined }]} />

        <section className="table__initials">
            <p>G</p>
            <p>W</p>
            <p>D</p>
            <p>L</p>
            <p>G.F</p>
            <p>G.A</p>
            <p>G.D</p>
            <p>P</p>
        </section>
        {table.map((team, index) => <TablePosition key={index} table={team} detail={detail} teams={teams}/>)}
    </ul>
}