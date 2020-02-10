const { Component, Fragment } = React

class App extends Component {
    state = { view: 'main', mainView: 'searchResults', error: undefined, user: undefined }



    __handleError__(error, messageType = 'error') {
        this.setState({ error: error.message })

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

                console.log(teams)
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
                    this.__handleError__(error)
                } else {
                    this.setState({ view: "login" })
                }
            })
        } catch (error) {
            this.__handleError__(error)
        }
    }

    handleGoToRegister = () => {
        this.setState({ view: "register" })
    }

    handleLogin = (username, password) => {
        debugger
        try {
            authenticateUser(username, password, (error, response) => {
                if (error) {
                    this.__handleError__(error)
                } else {
                    const token = response
                    this.handleSetToken(token)
                    retrieveUser(token, (error, user) => {
                        if (error) {
                            this.__handleError__(error)
                        } else {
                            this.setState({ view: "main", user })
                        }

                    })

                }

            })

        } catch (error) {
            this.__handleError__(error)
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
                    this.__handleError__(error)
                } else {
                    this.setState({ view: "main", user: Object.assign(this.state.user, newUser) })
                }
            })
        } catch (error) {
            this.__handleError__(error)
        }
    }

    handleGoToProfile = () => {
        this.setState({ view: "profile" })
    }

    /* REACT LIFECYCLES */

    componentDidMount() {
        this.handleRetrieveTeams()
    }

    render() {
        const { state: { view, mainView, user }, handleLogin, handleRegister, handleGoToRegister, handleGoToLogin, handleProfile, handleGoToProfile } = this

        return <div>
            <Header onGoToRegister={handleGoToRegister} onGoToLogin={handleGoToLogin} onGoToProfile={handleGoToProfile} />
            {user && <h2>Welcome {user.name} {user.surname}</h2>}
            <main>
                {view === 'register' && <Register onToSubmit={handleRegister} />}
                {view === 'login' && <Login onLogin={handleLogin} />}
                {view === "profile" && <Profile onSubmit={handleProfile} user={user} />}
                {view === 'main' &&
                    <div className="main">
                        <div className="sidemenu">
                            <Favorites />
                        </div>
                        <div>
                            {mainView === 'teamDetail' && <TeamDetail />}
                            {mainView === 'searchResults' && <SearchResults />}
                        </div>
                    </div>
                }

                {/*<Footer/>*/}
            </main>

        </div>
    }
}