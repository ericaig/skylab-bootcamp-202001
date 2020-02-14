const { Component } = React
class App extends Component {
    state = { view: undefined, sideMenuState: 'closed', detail: undefined, query: undefined, mainView: undefined, error: undefined, user: undefined, teams: [], favoriteTeams: [], events: {}, players: [], player: [], feedbackMessage: undefined, feedbackType: undefined, table: [] }

    __handleError__(feedbackMessage, feedbackType = 'error', timeout = 5000) {
        this.setState({ feedbackMessage, feedbackType })
        console.log(feedbackMessage)
        setTimeout(() => {
            this.setState({ feedbackMessage: undefined, feedbackType: undefined })
        }, timeout)
    }

    handleNavigation = (view, callback) => {
        this.setState({ mainView: view }, () => {
            if (typeof callback === 'function') callback()
        })
    }

    handleRetrieveTeams = (callback) => {
        address.search = {}

        try {
            const token = this.handleRetrieveToken()
            if (!token) return

            retrieveTeams(token, (error, teams) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    this.handleLogout()
                    return
                }

                this.setState({ teams, view: 'main', mainView: 'searchResults', detail: undefined }, () => {
                    if (typeof callback === 'function') callback()
                })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleSetToken = (token) => {
        sessionStorage.token = token
    }

    handleRetrieveToken = () => {
        return sessionStorage.token
    }

    handleRegister = (name, surname, age, city, username, password) => {
        try {
            registerUser(name, surname, age, city, username, password, (error) => {
                if (error) {
                    this.__handleError__(error.message)
                } else {
                    this.setState({ view: "login" })
                }
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToRegister = () => {
        address.hash = 'register'
        this.setState({ view: "register" })
    }

    handleRetrieveUser = (callback) => {
        try {
            const token = this.handleRetrieveToken()
            if (!token) {
                this.handleLogout()
                return
            }

            retrieveUser(token, (error, user) => {
                if (error) {
                    this.__handleError__(error.message)
                    this.handleLogout()
                } else {
                    this.setState({ view: "main", mainView: 'searchResults', user })
                    if (typeof callback === 'function') callback()
                }
            })
        } catch (error) {
            this.__handleError__(error.message)
            this.handleLogout()
        }
    }

    handleLogin = (username, password) => {
        try {
            authenticateUser(username, password, (error, response) => {
                if (error) {
                    this.__handleError__(error.message)
                } else {
                    const token = response
                    this.handleSetToken(token)
                    retrieveUser(token, (error, user) => {
                        if (error) {
                            this.__handleError__(error.message)
                        } else {
                            this.setState({ view: "login", user }, () => {
                                this.handleRetrieveFavoriteTeams()
                                this.handleRetrieveTeams()
                            })
                        }
                    })
                }
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToLogin = () => {
        address.hash = 'login'
        this.setState({ view: "login" })
    }

    handleProfile = (newUser) => {
        try {
            const token = this.handleRetrieveToken()
            updateUser(token, newUser, (error) => {
                if (error) {
                    this.__handleError__(error.message)
                } else {
                    this.setState({ view: "main", user: Object.assign(this.state.user, newUser) })
                    this.__handleError__("Update successfully!", "success")
                }
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToProfile = () => {
        address.hash = 'profile'
        this.setState({ view: "profile" })
    }

    handleSearchTeams = query => {
        this.setState({ query })
        if (!query) {
            this.handleRetrieveTeams()
            return
        }

        try {
            const token = this.handleRetrieveToken()

            address.search = { query }

            searchTeams(query, token, (error, teams) => {
                if (error instanceof Error) {
                    this.__handleError__("not results")
                    return
                }
                this.setState({ teams, query, view: 'main', mainView: 'searchResults', detail: undefined })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToDetail = (team, detailView = 'teamDetail') => {
        this.setState({ sideMenuState: 'closed' })

        if (!this.state.user) {
            this.__handleError__("You have to be logged in to view team details")
            return
        }

        const { idTeam } = team

        try {
            retrieveTeamDetail(idTeam, (error, detail) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }

                if (!detail){
                    this.__handleError__(`Team with id ${idTeam} doesn't exists`, 'info', 10000)
                    address.clear()
                    return
                }

                retrievePlayers(detail.strTeam, (error, players) => {
                    if (error instanceof Error) {
                        this.__handleError__(error.message)
                        return
                    }

                    retrieveTable(idTeam, (error, table) => {
                        if(error instanceof Error) {
                            this.__handleError__(error.message)
                            return
                        }
                        retrieveEvents(detail.idTeam, (error, events) => {
                            if (error instanceof Error) {
                                this.__handleError__(error.message)
                                return
                            }

                            const assignCurrentTeamDetail = (teamEvents, callback) => {
                                // let's assign @param detail to where idTeam coincides with future/past[inHomeTeam/intAwayTeam].idTeam
                                for (let i = 0; i < teamEvents.length; i++) {
                                    const event = teamEvents[i]
                                    if (event.idHomeTeam === idTeam) event.homeTeamDetail = detail
                                    else event.awayTeamDetail = detail

                                    if (typeof callback === 'function' && (i + 1) === teamEvents.length) callback()
                                }
                            }

                            const { future, past } = events

                            assignCurrentTeamDetail(future, () => {
                                assignCurrentTeamDetail(past, () => {
                                    //let's get other teams details

                                    const [, , section] = address.hash.split('/')
                                    if (section){
                                        const detailNavs = this.getDetailNavs()
                                        const viewIsValid = detailNavs.indexOf(section) !== -1
                                        if (viewIsValid) detailView = section
                                    }

                                    if (detailView === 'teamEvents') {
                                        this.__handleError__('Please wait, loading events', 'info')
                                    }

                                    this.setState({ detail, table, players, view: "main", mainView: detailView, query: undefined }, () => {
                                        address.hash = `detail/${idTeam}/${detailView}`
                                    })

                                    const assignOtherTeamsDetail = (teamEvents, callback) => {
                                        if (results.length !== teamEvents.length) {
                                            let teamId = ''
                                            let teamToUpdate = ''
                                            let currentEvent = teamEvents[position]

                                            if (currentEvent.idHomeTeam === idTeam) {
                                                teamId = currentEvent.idAwayTeam
                                                teamToUpdate = 'away'
                                            } else {
                                                teamId = currentEvent.idHomeTeam
                                                teamToUpdate = 'home'
                                            }

                                            retrieveTeamDetail(teamId, (error, otherTeamDetail) => {
                                                results.push(otherTeamDetail)

                                                if (teamToUpdate === 'away')
                                                    currentEvent.awayTeamDetail = otherTeamDetail
                                                else
                                                    currentEvent.homeTeamDetail = otherTeamDetail

                                                position++

                                                if (results.length !== teamEvents.length) {
                                                    assignOtherTeamsDetail(teamEvents, callback)
                                                } else {
                                                    if (typeof callback === 'function') callback()
                                                }
                                            })
                                        }
                                    }

                                    let results = [], position = 0
                                    assignOtherTeamsDetail(past, () => {
                                        results = []
                                        position = 0
                                        assignOtherTeamsDetail(future, () => {
                                            this.setState({ events })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoPlayerDetail = (nameTeam, namePlayer) => {
        try {
            retrievePlayerDetails(nameTeam, namePlayer, (error, player) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }
                this.setState({ view: "main", mainView: "playerDetail", player })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToResults = () => {
        address.clear()
        this.setState({ view: "main", mainView: "searchResults", detail: undefined })
    }

    handleGoPlayers = () => {
        this.setState({ view: "main", mainView: "players" })
    }

    handleNavButtonsClick = mainView => {
        this.setState({ view: 'main', mainView }, () => {
            address.hash = `detail/${this.state.detail.idTeam}/${mainView}`
        })
    }

    handleLogout = (callback) => {
        sessionStorage.clear()
        // address.clear()
        this.setState({ user: undefined, view: 'login', mainView: '' }, callback)
    }

    handleRetrieveFavoriteTeams = (callback) => {
        try {
            const token = this.handleRetrieveToken()
            if (!token) return

            retrieveFavTeams(token, (error, response) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }

                const { favoriteTeams, teams } = response

                if (typeof callback === 'function') {
                    this.setState({ favoriteTeams })
                    callback(favoriteTeams, teams)
                } else {
                    this.setState({ favoriteTeams, teams })
                }
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleFavClick = teamId => {
        if (!this.state.user) {
            this.__handleError__('Not logged in')
            return
        }

        try {
            const token = this.handleRetrieveToken()
            if (!token) {
                this.__handleError__('Invalid token')
                return
            }

            toggleTeamFav(teamId, token, (error) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }

                this.handleRetrieveFavoriteTeams((favoriteTeams, teams) => {
                    if (this.state.query) {
                        this.handleSearchTeams(this.state.query)
                    } else {
                        this.setState({ teams })
                    }
                })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    getDetailNavs = () => ['teamDetail', 'players', 'teamEvents', 'table']

    handleHashAddress = () => {
        if (address.hash) {
            const [link, id, section] = address.hash.split('/')
            if (link === 'detail') {
                let view = 'teamDetail'
                const detailNavs = this.getDetailNavs()
                const viewIsValid = detailNavs.indexOf(section) !== -1
                if (viewIsValid) view = section

                this.handleGoToDetail({ idTeam: id }, view)
            } else if (link === 'login' || link === 'register') {
                if (!this.handleRetrieveToken()) {
                    this.setState({ view: link, mainView: undefined })
                } else {
                    address.clear()
                    this.handleRetrieveUser(() => this.handleRetrieveFavoriteTeams())
                }
            } else if (link === 'profile') {
                if (this.state.user) {
                    this.setState({ view: link, mainView: undefined })
                }
            }else{
                address.clear()
            }
        } else if (address.search && Object.keys(address.search).length > 0) {
            const { search: { query } } = address

            if (query) this.handleSearchTeams(query)
        } else {
            // this.__handleError__('Nothing to handle', 'warning')
            // this.handleLogout()
        }
    }

    handleToggleSideMenu = () => {
        const sideMenuState = this.state.sideMenuState === 'open' ? 'closed' : 'open'
        this.setState({ sideMenuState })
    }

    /* REACT LIFECYCLES */

    componentWillMount() {
        if (this.handleRetrieveToken()) {
            // user is logged in
            this.handleRetrieveUser(() => {
                this.handleRetrieveFavoriteTeams()
                this.handleHashAddress()
            })
        } else {
            this.handleLogout(() => {
                this.handleHashAddress()
            })
        }
    }

    render() {
        const { state: { view, mainView, user, teams, query, detail, events, players, player, favoriteTeams, feedbackMessage, feedbackType, table, sideMenuState }, handleGoToDetail, handleSearchTeams, handleLogin, handleRegister, handleGoToRegister, handleGoToLogin, handleProfile, handleGoToProfile, handleNavigation, handleGoToResults, handleGoPlayerDetail, handleGoPlayers, handleNavButtonsClick, handleLogout, handleFavClick, handleToggleSideMenu } = this
        return <div>
            {feedbackMessage && <Feedback message={feedbackMessage} type={feedbackType} />}
            {user && <Header
                onGoToRegister={handleGoToRegister}
                onGoToLogin={handleGoToLogin}
                onGoToProfile={handleGoToProfile}
                onGoToResult={handleGoToResults}
                user={user}
                detail={detail}
                mainView={mainView}
                onLogoutClick={handleLogout}
                navButtonsClick={handleNavButtonsClick}
                onSearchSubmit={handleSearchTeams}
                toggleSideMenu={handleToggleSideMenu}
                query={query}
                view={view}
            />}
            <main>
                {view === 'register' && <Register onToSubmit={handleRegister} onGoToLogin={handleGoToLogin} />}
                {view === 'login' && <Login onLogin={handleLogin} onGoToRegister={handleGoToRegister} />}
                {view === "profile" && <Profile onSubmit={handleProfile} user={user} />}
                {view === 'main' &&
                    <div className="main">
                        <div className={`backdrop ${sideMenuState}`} onClick={handleToggleSideMenu}></div>
                        {user && <div className={`sidemenu ${sideMenuState}`}>
                        <Favorites favoriteTeams={favoriteTeams} goToDetail={handleGoToDetail} user={user} onLogoutClick={handleLogout} onGoToProfile={handleGoToProfile} />
                        </div>}
                        {/*<div></div>*/}
                        {mainView === 'teamDetail' && <TeamDetail detail={detail} goToResults={handleGoToResults} />}
                        {mainView === "teamEvents" && <ResultsEvents detail={detail} events={events} onToResults={handleGoToResults} />}
                        {mainView === 'searchResults' && <Results teams={teams} goToDetail={handleGoToDetail} query={query} onGoToPlayerDetail={handleGoPlayerDetail} onFavClick={handleFavClick} />}
                        {mainView === "players" && <Resultplayers  detail={detail} players={players} onClickPlayer={handleGoPlayerDetail} onToResults={handleGoToResults} />}
                        {mainView === "playerDetail" && player && <PlayerDetail player={player} onGoToPlayers={handleGoPlayers} />}
                        {mainView === "table" && <ResultTable table={table} onToResults={handleGoToResults} detail={detail} teams={teams} />}
                    </div>
                }
                {/*<Footer/>*/}
            </main>
        </div>
    }
}