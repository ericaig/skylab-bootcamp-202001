function retrieveEvents(teamId, callback) {
    if (typeof teamId !== "string") throw new TypeError(`${teamId} is not a string`)
    if (!teamId.trim()) throw new Error(`teamId ${teamId} is empty`)
    if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`)

    const events = {future:[], past: []}

    call(`https://www.thesportsdb.com/api/v1/json/1/eventsnext.php?id=${teamId}`, undefined, (error, response)=>{
        if (error) return callback(error,events)
        const next = JSON.parse(response.content)
        events.future = next.events
       
        call(`https://www.thesportsdb.com/api/v1/json/1/eventslast.php?id=${teamId}`, undefined, (error, response) => {
            if (error) return callback(error, events)
            const last = JSON.parse(response.content)
            events.past = last.results
             callback(error, events)
        })
    })


}