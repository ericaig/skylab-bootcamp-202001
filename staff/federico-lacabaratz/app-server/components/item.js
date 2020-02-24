const Detail = require('./detail')

module.exports = function (props = {}) {
    const { item: {id, name, thumbnail, price, isFav} } = props

    return `<li>
        <h3>${name}<h3><form action="/toggle-fav/${id}" method="POST">
        <button type="submit" name="isFav">
            <span class="fav"">${isFav ? '❤️' : '🤍'}</span>
        </button>
        </form>
        <form action="/detail/${id}" method="GET">
        <button type="submit" name="query" value=${id}><img src=${thumbnail}></button>
        </form>
        <span>${price} €</span>
    </li>`

}
