function Favorites({ favoriteTeams, goToDetail, user, onLogoutClick }) {
    console.log(favoriteTeams)
    return <ul className="favorites"> 
        {user && <li className="sideMenu__item hide-lg">
            <h4 className="favorite__name no-margin no-padding">
                <i className="fas fa-user"></i>&nbsp;
                <span>{`${user.name} ${user.surname}`}</span>
            </h4>
        </li>}
        
        {favoriteTeams && favoriteTeams.map((team, index) => <FavoriteItem key={index} team={team} goToDetail={goToDetail} /> ) }
        {!favoriteTeams.length && <div className="fav__notif">Click on <i className="fas fa-futbol"></i>&nbsp; to add teams to favourite</div>}
    
        <li className="sideMenu__item text-danger hide-lg" onClick={() => onLogoutClick()}>
            <div className="favorite__name">Logout&nbsp;<i className="fas fa-sign-out-alt"></i></div>
        </li>
    </ul>
}