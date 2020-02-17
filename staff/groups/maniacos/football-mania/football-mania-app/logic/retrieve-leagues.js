function retrieveLeagues(callback) {
    // if (typeof idLeague !== "string") throw new TypeError(`${idLeague} is not a string`)
    // if (!idLeague.trim()) throw new Error(`idLeague ${idLeague} is empty`)
    if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`)

    call(`https://www.thesportsdb.com/api/v1/json/1/search_all_leagues.php?c=Spain`, undefined, (error, response)=>{
        if (error) return callback(error,events)
        const content = JSON.parse(response.content)
        let leagues = []
    
        for(let i = 0; i < content.countrys.length; i++){
            const league = content.countrys[i]
            if(content.countrys[i].idLeague === "4335") leagues.push(league)
        }

        call(`https://www.thesportsdb.com/api/v1/json/1/search_all_leagues.php?c=England`, undefined, (error, response) => {
            if (error) return callback(error, events)
            const content = JSON.parse(response.content)

            for(let i = 0; i < content.countrys.length; i++){
                const league = content.countrys[i]
                if(content.countrys[i].idLeague === "4328") leagues.push(league)
            }

             callback(error, leagues)
        })
    })
}