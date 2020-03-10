import React, { useEffect, useContext } from 'react'
import Login from './Login'
import Register from './Register'
import Landing from './landing'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { Context } from './ContextProvider'

export default withRouter(function ({ history }) {
  const [state, setState] = useContext(Context)

  function handleGoToLogin() {
    // history.push('/login')
  }

  function handleGoToRegister() {
    // history.push('/register')
  }

  function handleMountLogin() {
    // setState({ page: 'login' })
  }

  function handleMountRegister() {
    // setState({ page: 'register' })
  }

  function handleRegister(name, surname, email, password) {

  }

  function handleLogin(email, password) {

  }

  useEffect(() => {

  }, [])

  const { error } = state

  return <div className="App">
    <Route exact path="/" render={() => <Landing/>} />
    <Route path="/register" render={() => <Register onSubmit={handleRegister} error={error} onGoToLogin={handleGoToLogin} onMount={handleMountRegister} />} />
    <Route path="/login" render={() => <Login onSubmit={handleLogin} error={error} onGoToRegister={handleGoToRegister} onMount={handleMountLogin} />} />
    {/* <Route path="/home" render={() => isLoggedIn() ? <Home /> : <Redirect to="/login" />} /> */}
  </div>
})