module.exports = function (props={}) {
    const { detail: { id, name, year, price, image, color, maker, style, collection, description, url } } = props


return `<section>
<form action='/back' method="GET"><button>Go Back</button></form>
    <h3>${name} (${year})</h3>
        <img src=${image} />
        <span>${price} €</span>
        <p>${color}</p>
        <p>${maker}</p>
        <p>${collection}</p>
        <p>${style}</p>
        <p>${description}</p>
        <a href=${url}>${url}</a>
    </section>`
}














