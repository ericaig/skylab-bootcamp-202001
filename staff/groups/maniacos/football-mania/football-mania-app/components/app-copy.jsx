const { Component } = React

class App extends Component {
    state = { view: 'main', query: undefined, mainView: 'searchResults', error: undefined, user: undefined, teams: [], players: [], player: [] }



    __handleError__(error, messageType = 'error') {
        this.setState({ error: error })

        console.log(error)

        setTimeout(() => {
            this.setState({ error: undefined })
        }, 3000)
    }


    handleRetrieveTeams = () => {
        try {
            retrieveTeams((error, teams) => {
                if (error instanceof Error) {
                    this.handleFeedback(error.message)
                    return
                }

                this.setState({ teams, view: 'main', mainView: 'searchResults' })
            })
        } catch (error) {
            this.handleFeedback(error.message)
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
                            this.setState({ view: "main", user })
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
        if(!query) {
            this.handleRetrieveTeams()
            return
        }

        this.setState({ query })

        try {
            searchTeams(query, (error, teams) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }

                this.setState({ teams, view: 'main', mainView: 'searchResults' })
            })
        } catch (error) {
            this.__handleError__(error.message)
        }
    }

    handleGoToDetail = (team) => {
        try{
            retrievePlayers(team.strTeam, (error, players) => {
                if (error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }
    
                this.setState({players, view: "main", mainView: "players"})
            })

        } catch (error){
            this.__handleError__(error.message)
        } 
    }

    handleGoPlayerDetail = (nameTeam, namePlayer) => {
        try{
            retrievePlayerDetails(nameTeam, namePlayer, (error, player) =>{
                if(error instanceof Error) {
                    this.__handleError__(error.message)
                    return
                }
                this.setState({view: "main", mainView: "playerDetail", player})
            })
        }catch(error){
            this.__handleError__(error.message)
        }
    }

    handleGoPlayers = () => {
        this.setState({view: "main", mainView: "players"})
    }

    handleGoResults = () => {
        this.setState({view: "main", mainView: "searchResults"})
    }

    /* REACT LIFECYCLES */

    componentDidMount() {
        this.handleRetrieveTeams()
    }

    render() {
        const { state: { view, mainView, user, teams, query, players, player }, handleGoToDetail, handleSearchTeams, handleLogin, handleRegister, handleGoToRegister, handleGoToLogin, handleProfile, handleGoToProfile, handleGoPlayerDetail, handleGoPlayers, handleGoResults } = this

        return <div>
            <Header
                onGoToRegister={handleGoToRegister}
                onGoToLogin={handleGoToLogin}
                onGoToProfile={handleGoToProfile}
                user={user}
                onSearchSubmit={handleSearchTeams}
            />
            <main>
                {view === 'register' && <Register onToSubmit={handleRegister} />}
                {view === 'login' && <Login onLogin={handleLogin} />}
                {view === "profile" && <Profile onSubmit={handleProfile} user={user} />}
                {view === 'main' &&
                    <div className="main">
                        {user && <div className="sidemenu">
                            <Favorites />
                        </div>}
                        <div>
                            {mainView === 'teamDetail' && <TeamDetail />}
                        {mainView === 'searchResults' && <Results teams={teams} goToDetail={handleGoToDetail} query={query} onGoToPlayerDetail={handleGoPlayerDetail} />}
                        {mainView === "players" && <Resultplayers players={players} onClickPlayer={handleGoPlayerDetail} onToResults={handleGoResults} />}
                        {mainView === "playerDetail" && player && <PlayerDetail player={player} onGoToPlayers={handleGoPlayers} />}
                        </div>
                    </div>
                }

                {/*<Footer/>*/}
            </main>

        </div>
    }
}