function ResultsEvents({events,onToResults} ){
    const {future, past} = events
    return <div>
        <a href="" onClick={event=>{
            event.preventDefault()
            onToResults()
        }}>Go back to Results</a>

        <h2>Past Events</h2>
        {past && past.map((item, index)=> <ItemEvents key={index} item={item} />)}
        <h2>Next Events</h2>
        {future && future.map((item, index)=> <ItemEvents key={index} item={item}/>)}
    </div>
}