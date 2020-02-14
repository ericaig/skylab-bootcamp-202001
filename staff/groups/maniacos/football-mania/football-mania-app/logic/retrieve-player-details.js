/**
 * @param {string} strTeam - Team's name
 * @param {string} strPlayer - Player's name
 * @param {function} callback - Callback to execute after retrieving player's details. It returns error and an array with an object
 * @throws Will throw an error if an argument doesn't match it's type
 */

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