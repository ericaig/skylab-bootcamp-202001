module.exports = function({ item: { id, name, thumbnail, price, isFav } }) {
    return `
        <li className="results--item item">
            <h3>${name} 
                <span>
                ${isFav}
                    <form class="search" action="/toggleFav/${id}" method="POST">
                        <button>${isFav ? '💖' : '🤍'}</buton>
                    </form>
                </span>
            </h3>
            <a href="/detail/${id}">
                <img src="${thumbnail}" />
                <span>${price} €</span>
            </a>
        </li>`
}