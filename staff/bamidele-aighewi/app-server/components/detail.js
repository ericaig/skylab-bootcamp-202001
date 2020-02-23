module.exports = function({ vehicle: { id, name, year, price, image, color, maker, collection, description, url, isFav }, style: { name: styleName, image: styleImage, url: styleUrl } }) {
    return `<li>
        <h3>
            ${name} (${year})
            <form class="search" action="/toggleFav/${id}" method="POST">
                <button class="detail__fav">${isFav ? '💖' : '🤍'}</buton>
            </form>
        </h3>
        <img src=${image} />
        <span>${price} €</span>
        <p>${color}</p>
        <p>${maker}</p>
        <p>${collection}</p>
        <p>
            <a href=${styleUrl} target="_blank">${styleName}</a>
            <img src=${styleImage} />
        </p>
        <p>${description}</p>
        <a href=${url}>${url}</a>
    </li>`
}