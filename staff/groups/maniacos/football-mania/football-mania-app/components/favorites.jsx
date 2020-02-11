function Favorites({ favoriteTeams, goToDetail }) {
    return <ul className="favorites"> 
        {favoriteTeams && favoriteTeams.map((team, index) => <FavoriteItem key={index} team={team} goToDetail={goToDetail} /> ) }
    </ul>
}