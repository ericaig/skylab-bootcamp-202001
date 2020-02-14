/**
 * @param {function} callback - Callback to execute after retrieving a leagues current team's ranking. It returns error and an array with objects
 * @throws Will throw an error if an argument doesn't match it's type
 */

function retrieveTable(callback) {
    if (typeof callback !== "function") throw new TypeError(`${callback} is not a function`)

    call(`https://www.thesportsdb.com/api/v1/json/1/lookuptable.php?l=4335&s=1920`, undefined, (error, response) => {
        if (error) return callback(error, response)
        const content = JSON.parse(response.content)
        callback(error, content.table)
    })
}