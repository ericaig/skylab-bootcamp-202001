module.exports = function (props = {}) {
    const { item: {id, name, thumbnail, price} } = props

    return `<li>
        <article>
            <h3>${name}</h3>
        </article>
        <article name=${id}> 
            <img src=${thumbnail}>
            <span>${price} €</span>
        </article>
    </li>`

}
