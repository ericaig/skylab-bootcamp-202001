import React, { useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Login from './Login'
import Register from './Register'
import Landing from './Landing'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { Context } from './ContextProvider'
import Header from './Header'
// import Footer from './Footer'
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import './App.sass'
import { isLoggedIn, logout } from '../logic'
import { ControlPanel, WeekDays, Calendar, Events, Signings, Dashboard } from './cpanel'
// import ErrorBoundary from './ErrorBoundary'

const useStyles = makeStyles(theme => ({
  app: {
    backgroundColor: '#ffffff'
  },
  main: {
    // paddingBottom: theme.spacing(3),
    position: 'relative',
    backgroundColor: theme.palette.grey[0],
    color: theme.palette.common.white,
  },
}))

export default withRouter(function ({ history }) {
  const [state] = useContext(Context)
  const classes = useStyles()

  // const sections = [
  //   { title: 'Technology', url: '/' },
  //   { title: 'Design', url: '/' },
  //   { title: 'Culture', url: '/' },
  // ]

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

  function handleGotoControlPanel() {
    history.push('/cpanel')
  }

  function handleLogout() {
    logout()
    history.push('/login')
    // window.location.reload()
  }

  useEffect(() => {

  }, [])

  const { error } = state

  return <>
    <Route path="/">
      <div className={classes.app}>
        <Header handleLogout={handleLogout} handleGotoControlPanel={handleGotoControlPanel} />
        <Paper className={classes.main} elevation={0} square>
          <Divider />
          <Route exact path="/" render={() => <Landing />} />
          <Route path="/register" render={() => !isLoggedIn() ? <Register onSubmit={handleRegister} error={error} onGoToLogin={handleGoToLogin} onMount={handleMountRegister} /> : <Redirect to="/cpanel" />} />
          <Route path="/login" render={() => !isLoggedIn() ? <Login onSubmit={handleLogin} error={error} onGoToRegister={handleGoToRegister} onMount={handleMountLogin} /> : <Redirect to="/cpanel" />} />
        </Paper>
        {/* <Footer title="Footer" description="Something here to give the footer a purpose!" /> */}
      </div>
    </Route>

    <Route path="/cpanel" render={({ match: { url } }) => {
      return isLoggedIn() ?
        <ControlPanel handleLogout={handleLogout}>
          <Route path={url} exact><Dashboard/></Route>
          <Route path={`${url}/week-days`}><WeekDays /></Route>
          <Route path={`${url}/signings`}><Signings/></Route>
          <Route path={`${url}/calendar`}><Calendar /></Route>
          <Route path={`${url}/events`}><Events /></Route>
        </ControlPanel>
        : <Redirect to="/login" />
    }} />
  </>
})