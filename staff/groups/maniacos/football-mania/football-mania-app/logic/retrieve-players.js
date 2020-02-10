function retrievePlayers(strTeam, callback) {
    //debugger
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
    
    call(`https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?t=${strTeam}&p=`, undefined, (error, response) => {
        const content = JSON.parse(response.content)

        // let players = []

        // for (let i = 0; i < content.player.length; i++) {
        //     const player = content.player[i]

        //     // filtrar equips de primera divisió
        //     if (content.player[i].strRender !== null) players.push(player)
        // }

        callback(error, content.player)
    })
}