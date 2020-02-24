const Item = require('./item')

module.exports = function (props = {}) {
    const { vehicles } = props

    return `<ul className="results">
        ${vehicles.map(item => Item({item})).join('')}
    </ul>`
}