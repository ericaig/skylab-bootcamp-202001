function retrieveTeamDetail(teamId, callback) {
    if(typeof teamId !== 'string') throw new TypeError(`${teamId} is not a string`)
    if(!teamId.trim()) throw new Error('teamId is empty')
    if(typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)

    call(`https://www.thesportsdb.com/api/v1/json/1/lookupteam.php?id=${teamId}`, undefined, (error, response) => {
        const content = JSON.parse(response.content)
        let teams = []
        let detail = {}

        if (content.teams) {
            for (let i = 0; i < content.teams.length; i++) {
                const team = content.teams[i]

                // filtrar equips de primera divisió
                if (team.idLeague == 4335) teams.push(team)
            }

            detail = teams[0]
        }

        callback(error, detail)
    })
}