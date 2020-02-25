module.exports = function (props = {}) {
    const { item: {id, name, thumbnail, price, isFav} } = props

    return `<li>
        <h3>${name}<form action="/toggle-fav/${id}" method="POST"><button>${isFav ? '❤️' : '🤍'}</button></form><h3>
        <form action="/detail/${id}" method="GET">
        <button type="submit" name="query" value=${id}><img src=${thumbnail}></button>
        </form>
        <span>${price} €</span>
    </li>`
}
