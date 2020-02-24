const Detail = require('./detail')

module.exports = function (props = {}) {
    const { item: {id, name, thumbnail, price} } = props

    return `<li>
        <h3>${name}</h3>
        <form action="/detail/${id}" method="GET">
        <button type="submit" name="query" value=${id}><img src=${thumbnail}></button>
        </form>
        <span>${price} €</span>
    </li>`

}
