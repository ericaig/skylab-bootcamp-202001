const { Component } = React

class App extends Component {
    state = { view: 'main', query: undefined, mainView: 'searchResults', error: undefined, user: undefined, teams: [], events:{}}



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

    handleGoToDetail = team => {
        try{
            retrieveEvents(team.idTeam, (error, events) =>{
                if (error instanceof Error){
                this.__handleError__(error.message)
                return
                }
                this.setState({mainView: "teamEvents", events})
            })
        }catch(error){
            this.__handleError__(error.message)
        }
    }

    handleGoToResults = () => {
        this.setState({mainView: "searchResults"})
    }

    /* REACT LIFECYCLES */

    componentDidMount() {
        this.handleRetrieveTeams()
    }

    render() {
        const { state: { view, mainView, user, teams, query, events}, handleGoToDetail, handleSearchTeams, handleLogin, handleRegister, handleGoToRegister, handleGoToLogin, handleProfile, handleGoToProfile, handleGoToResults} = this

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
                            {mainView === "teamEvents" && <ResultsEvents events={events} onToResults={handleGoToResults}/>}
                        {mainView === 'searchResults' && <Results teams={teams} goToDetail={handleGoToDetail} query={query} />}
                        </div>
                    </div>
                }

                {/*<Footer/>*/}
            </main>

        </div>
    }
}