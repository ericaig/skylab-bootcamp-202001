function retrieveTable(idTeam, callback) {
    if (typeof callback !== "function") throw new TypeError(`callback ${callback} is not a function`)

    call(`https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=4335&s=1920`, undefined, (error, response) => {
        if (error) return callback(error, response)
        const content = JSON.parse(response.content)

        callback(idTeam, (error, content.table))
    })
}