function searchTeams(query, callback) {
    if (typeof query !== 'string') throw new TypeError(`${query} is not a string`)
    if (!query.trim()) throw new Error('query is empty')
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    call(`https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${encodeURI(query)}`, undefined, (error, response) => {
        const content = JSON.parse(response.content)
        let teams = []

        if (content.teams) {
            for (let i = 0; i < content.teams.length; i++) {
                const team = content.teams[i]

                // filtrar equips de primera divisió
                if (team.idLeague == 4335) teams.push(team)
            }
        }

        callback(error, teams)
    })
}