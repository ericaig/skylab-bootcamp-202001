function retrievePlayerDetails(strTeam, strPlayer, callback){
    if (typeof strTeam !== "string") throw new TypeError(`${strTeam} is not a string`)
    if (!strTeam.trim()) throw new Error(`team name is empty`)
    if (typeof strPlayer !== "string") throw new TypeError(`${strPlayer} is not a string`)
    if (!strPlayer.trim()) throw new Error(`player name is empty`)
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
    
    call(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?t=${strTeam}&p=${strPlayer}`, undefined, (error, response) => {
        const content = JSON.parse(response.content)

        callback(error, content.player)
    })
}