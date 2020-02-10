function retrieveTeams(callback) {
    if (typeof callback !== 'function') throw new TypeError(`${callback} is not a function`)
    
    call('https://www.thesportsdb.com/api/v1/json/1/search_all_teams.php?s=Soccer&c=Spain', undefined, (error, response) => {
        const content = JSON.parse(response.content)
        let teams = []

        for (let i = 0; i < content.teams.length; i++) {
            const team = content.teams[i]

            // filtrar equips de primera divisió
            if (team.idLeague == 4335) teams.push(team)
        }

        callback(error, teams)
    })
}