function Header({onGoToRegister, onGoToLogin, onGoToProfile}){
    return <div>
        <header className="header header-xs">
            <div className="header__logo">logo</div>
            <div className="header__userInteractions">
                <div className="header__userInteractionIcon">
                    <i className="fas fa-search"></i>
                </div>
                <div className="header__userInteractionIcon">
                    <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="header__userInteractionIcon">
                    <i className="fas fa-bars"></i>
                </div>
            </div>
        </header>
        <header className="header header-lg">
            <section className="header__primary">
                <nav className="header__brands">
                    {/*<div className="header__brand">
                        NikePlus
                    </div>
                    <div className="header__brand">
                        <i className="fab fa-staylinked"></i>
                    </div>*/}
                    <div className="header__brand" onClick={(event)=>{
                        event.preventDefault()
                        onGoToProfile()
                    }}>
                        <i className="fas fa-user"></i>&nbsp;
                        {/* Pepito Pellejo */}

                    </div>
                    <div className="header__brand">
                        <i className="fas fa-sign-out-alt"></i>&nbsp;
                        Logout
                    </div>
                </nav>
                <nav className="header__accountNavs">
                    <div className="header__accountNav" onClick={(event =>{
                        event.preventDefault()
                        onGoToRegister()
                    })}>
                        Regístrate 
                    </div>
                    <div className="header__accountNav" onClick={(event =>{
                        event.preventDefault()
                        onGoToLogin()
                    })}>
                        Inicia sessión
                    </div>
                    {/*<div className="header__accountNav">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="header__accountNav">
                        <i className="fas fa-map-pin"></i>&nbsp;España
                    </div>*/}
                </nav>
            </section>
            <section className="header__secondary">
                <section className="header__secondaryLogo"></section>
                <section className="header__secondaryNavs">
                    <div className="header__secondaryNav">Details</div>
                    <div className="header__secondaryNav active">Players</div>
                    <div className="header__secondaryNav">Next Events</div>
                    {/*<div className="header__secondaryNav">Niño/a</div>
                    <div className="header__secondaryNav">Personalitzar</div>
                    <div className="header__secondaryNav">Colecciones</div>*/}
                </section>
                <section className="header__secondarySearch searchbar">
                    <div className="searchbar__group">
                        <div className="searchbar__iconContainer">
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="searchbar__inputContainer">
                            <input type="text" placeholder="Buscar" className="searchbar__input" />
                        </div>
                    </div>
                </section>
            </section>
        </header>
    </div>
}