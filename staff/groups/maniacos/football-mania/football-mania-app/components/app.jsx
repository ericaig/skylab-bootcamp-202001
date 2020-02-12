const { Component } = React
class App extends Component {
    state = { view: 'main', detail: undefined, query: undefined, mainView: 'searchResults', error: undefined, user: undefined, teams: [], favoriteTeams: [], events: {}, players: [], player: [], feedbackMessage: undefined, feedbackType: undefined }

    __handleError__(feedbackMessage, feedbackType = 'error') {
        this.setState({ feedbackMessage, feedbackType })
        console.log(feedbackMessage)
        setTimeout(() => {
            this.setState({ feedbackMessage: undefined, feedbackType: undefined })
        }, 3000)
    }

    handleNavigation = (view, callback) => {
        this.setState({ mainView: view }, () => {
            if (typeof callback === 'function') callback()
        })
    }

    handleRetrieveTeams = (callback) => {
        try {
            const token = this.handleRetrieveToken()
            if (!token || !this.state.user) return this.__handleError__("You have to be logged in")

            retrieveTeams(token, (error, teams) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    this.handleLogout()
                    return
                }
                console.log(teams)
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
        this.setState({ view: "register" })
    }

    handleRetrieveUser = () => {
        const token = this.handleRetrieveToken()
        if (!token) return

        retrieveUser(token, (error, user) => {
            if (error) {
                this.__handleError__(error.message)
            } else {
                this.setState({ view: "main", mainView: 'searchResults', user })
            }
        })
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
                            this.setState({ view: "main", user }, () => {
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
            searchTeams(query, token, (error, teams) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }
                this.setState({ teams, view: 'main', mainView: 'searchResults', detail: undefined })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToDetail = (team) => {
        if (!this.state.user) {
            this.__handleError__("You have to be logged in to view team details")
            return
        }

        try {
            retrieveTeamDetail(team.idTeam, (error, detail) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }
                retrievePlayers(team.strTeam, (error, players) => {
                    if (error instanceof Error) {
                        this.__handleError__(error.message)
                        return
                    }
                    retrieveEvents(team.idTeam, (error, events) => {
                        if (error instanceof Error) {
                            this.__handleError__(error.message)
                            return
                        }
                        this.setState({ detail, players, events, view: "main", mainView: 'teamDetail' })
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
        this.setState({ view: "main", mainView: "searchResults",detail: undefined })
    }

    handleGoPlayers = () => {
        this.setState({ view: "main", mainView: "players" })
    }

    handleNavButtonsClick = mainView => {
        this.setState({ view: 'main', mainView })
    }

    handleLogout = () => {
        sessionStorage.clear()
        this.setState({ user: undefined, view: 'login', mainView: '' })
    }

    handleRetrieveFavoriteTeams = (callback) => {
        try {
            const token = this.handleRetrieveToken()
            if(!token) return 

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

                this.handleRetrieveFavoriteTeams((favoriteTeams, teams)=>{

                    if (this.state.query) {
                        this.handleSearchTeams(this.state.query)
                    } else {
                        this.setState({teams})
                    }
                    
                    })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    /* REACT LIFECYCLES */
    componentWillMount() {

    }

    componentDidMount() {
        this.handleRetrieveFavoriteTeams()

        this.handleRetrieveTeams(() => {
            this.handleRetrieveUser()
        })
    }

    render() {
        const { state: { view, mainView, user, teams, query, detail, events, players, player, favoriteTeams , feedbackMessage, feedbackType}, handleGoToDetail, handleSearchTeams, handleLogin, handleRegister, handleGoToRegister, handleGoToLogin, handleProfile, handleGoToProfile, handleNavigation, handleGoToResults, handleGoPlayerDetail, handleGoPlayers, handleNavButtonsClick, handleLogout, handleFavClick } = this
        return <div>
            {feedbackMessage && <Feedback message={feedbackMessage} type={feedbackType} />}
            <Header
                onGoToRegister={handleGoToRegister}
                onGoToLogin={handleGoToLogin}
                onGoToProfile={handleGoToProfile}
                user={user}
                detail={detail}
                mainView={mainView}
                onLogoutClick={handleLogout}
                navButtonsClick={handleNavButtonsClick}
                onSearchSubmit={handleSearchTeams}
            />
            <main>
                {view === 'register' && <Register onToSubmit={handleRegister} />}
                {view === 'login' && <Login onLogin={handleLogin} />}
                {view === "profile" && <Profile onSubmit={handleProfile} user={user} />}
                {view === 'main' &&
                    <div className="main">
                        {user && <div className="sidemenu">
                            <Favorites favoriteTeams={favoriteTeams} goToDetail={handleGoToDetail} />
                        </div>}
                        {/*<div></div>*/}
                        {mainView === 'teamDetail' && <TeamDetail detail={detail} goToResults={handleGoToResults} />}
                        {mainView === "teamEvents" && <ResultsEvents events={events} onToResults={handleGoToResults} />}
                        {mainView === 'searchResults' && <Results teams={teams} goToDetail={handleGoToDetail} query={query} onGoToPlayerDetail={handleGoPlayerDetail} onFavClick={handleFavClick} />}
                        {mainView === "players" && <Resultplayers players={players} onClickPlayer={handleGoPlayerDetail} onToResults={handleGoToResults} />}
                        {mainView === "playerDetail" && player && <PlayerDetail player={player} onGoToPlayers={handleGoPlayers} />}
                    </div>
                }
                {/*<Footer/>*/}
            </main>
        </div>
    }
}