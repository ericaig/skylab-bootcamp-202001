const Item = require('./item')

module.exports = function ({ results }) {
    let output = ''

    if(results.length){
        results.forEach(item => output += `${Item({item})}`)
        output = `<ul class="results">${output}</ul>`
    }

    return output
}