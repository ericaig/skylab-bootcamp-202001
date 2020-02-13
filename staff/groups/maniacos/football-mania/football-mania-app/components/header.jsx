function Header({ onGoToRegister, onGoToLogin, onGoToProfile, user, onSearchSubmit, detail, navButtonsClick, mainView, onLogoutClick, view, onGoToResult, toggleSideMenu }) {
    return <div className="sticky__header">
        {view !== "login" && view !== "register" && <header className="header header-xs">
            <div className="header__logo">logo</div>
            <div className="header__userInteractions">
                <div className="header__userInteractionIcon">
                    <i className="fas fa-search"></i>
                </div>
                <div className="header__userInteractionIcon" onClick={()=>{
                    toggleSideMenu()
                }}>
                    <i className="fas fa-bars"></i>
                </div>
            </div>
        </header>}
        {view !== "login" && view !== "register" && <header className="header header-lg">
            <section className="header__primary">
                {user && <nav className="header__brands">                    
                    <div className="header__brand" onClick={(event) => {
                        event.preventDefault()
                        onGoToProfile()
                    }}>
                        <span>{`${user.name} ${user.surname}`}</span>&nbsp;
                        <i className="fas fa-user"></i>
                    </div>
                    
                    <div className="header__brand" onClick={() => onLogoutClick() }>
                        Logout&nbsp;
                        <i className="fas fa-sign-out-alt"></i>
                    </div>
                </nav>}
                
                {!user && 
                <nav className="header__accountNavs">
                    <div className="header__accountNav" onClick={(event => {
                        event.preventDefault()
                        onGoToRegister()
                    })}>
                        Regístrate
                    </div>
                    <div className="header__accountNav" onClick={(event => {
                        event.preventDefault()
                        onGoToLogin()
                    })}>
                        Inicia sessión
                    </div>
                </nav>}
            </section>
            <section className="header__secondary">
                <section className="header__secondaryLogo" onClick={event=>{
                    event.preventDefault()
                    onGoToResult()
                }}></section>
                {user && detail && view !== "profile" && <section className="header__secondaryNavs">
                    <div className={`header__secondaryNav ${mainView === 'teamDetail' ? ' active' : ''}`} onClick={(event)=>{
                        navButtonsClick('teamDetail')
                    }}>Details</div>
                    <div className={`header__secondaryNav ${mainView === 'players' || mainView === 'playerDetail' ? ' active' : ''}`} onClick={(event) => {
                        navButtonsClick('players')
                    }}>Players</div>
                    <div className={`header__secondaryNav ${mainView === 'teamEvents' ? ' active' : ''}`} onClick={(event) => {
                        navButtonsClick('teamEvents')
                    }}>Next Events</div>
                    <div className={`header__secondaryNav ${mainView === 'table' ? ' active' : ''}`} onClick={(event) => {
                        navButtonsClick('table')
                    }}>Table</div>
                </section>}
                <section className="header__secondarySearch searchbar">
                    <div className="searchbar__group">
                        <div className="searchbar__iconContainer">
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="searchbar__inputContainer">
                            <form onSubmit={event=>{
                                event.preventDefault()
                                const query = event.target.query.value
                                onSearchSubmit(query)
                            }}>
                                <input type="text" name="query" placeholder="Buscar" className="searchbar__input" />
                            </form>
                        </div>
                    </div>
                </section>
            </section>
        </header>}
    </div>
}