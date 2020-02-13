function ResultTable({table, onToResults}){
    return <ul className="table__container">
        <a href="" onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>Go back to Results</a>
        {table.map((team, index) => <TablePosition key={index} table={team} />)}
    </ul>
}