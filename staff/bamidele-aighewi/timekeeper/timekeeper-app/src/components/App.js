import React, { useEffect, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Login from './Login'
import Register from './Register'
import Landing from './Landing'
import { Route, withRouter, Redirect } from 'react-router-dom'
import Header from './Header'
import WorkerCreate from './WorkerCreate'
// import Footer from './Footer'
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import './App.sass'
import { isLoggedIn, logout, retrieveUser, retrieveCompany, context } from '../logic'
// import session from '../logic/context'
import { ControlPanel, WeekDays, Calendar, Events, Dashboard, Profile, Company, Users } from './cpanel'
// import ErrorBoundary from './ErrorBoundary'
// import { Context } from './ContextProvider'
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

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

export default withRouter(function ({ history, location }) {
  const classes = useStyles()
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  // const [session, setSession] = useState({})
  // const [state, setState] = useContext(Context)

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

  function handleGotoProfilePage() {
    history.push('/cpanel/profile')
  }

  function handleLogout() {
    // logout()
    // history.push('/login')
    console.log('SHOULD LOGOUT')
  }

  function handleToggleSnackbar(visibility) {
    setSnackbar((oldValues) => { return { ...oldValues, open: visibility } })
  }

  function handleSnackbar(message, severity) {
    setSnackbar({ ...snackbar, message, severity })
    handleToggleSnackbar(true)
  }

  // async function handleRetrieveSessionDatas() {
  //   if (!isLoggedIn()) return

  //   try {
  //     const user = await retrieveUser()
  //     const company = await retrieveCompany()
  //     context.user = user
  //     context.company = company
  //     // console.log('context', context)
  //     // session = { ...session, user, company }
  //     // console.log(user, company)
  //   } catch ({ message }) {
  //     console.log(message)
  //     handleLogout()
  //   }
  // }

  useEffect(() => {
    if (isLoggedIn()) {
      (async () => {
        try {
          const _user = await retrieveUser()
          const _company = await retrieveCompany()
          if (Object.keys(_user).length && Object.keys(_company).length) {
            context.user = _user
            context.company = _company
            console.log('_company', _company)
            return
          }
          handleLogout()
        } catch ({ message }) {
          handleLogout()
        }
      })()
    }
  }, [])

  return <>
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={snackbar.open} autoHideDuration={6000} onClose={() => handleToggleSnackbar(false)}>
      <Alert elevation={0} variant="filled" onClose={() => handleToggleSnackbar(false)} severity={snackbar.severity}>
        {snackbar.message}
      </Alert>
    </Snackbar>

    <Route path="/">
      <div className={classes.app}>
        <Header handleLogout={handleLogout} handleGotoProfilePage={handleGotoProfilePage} handleGotoControlPanel={handleGotoControlPanel} />
        <Paper className={classes.main} elevation={0} square>
          <Divider />
          <Route exact path="/" render={() => <Landing />} />
          <Route path="/register" render={() => !isLoggedIn() ? <Register onSubmit={handleRegister} onGoToLogin={handleGoToLogin} onMount={handleMountRegister} /> : <Redirect to="/cpanel" />} />
          <Route path="/login" render={() => !isLoggedIn() ? <Login onSubmit={handleLogin} onGoToRegister={handleGoToRegister} onMount={handleMountLogin} /> : <Redirect to="/cpanel" />} />
          <Route path="/invite/:token"><WorkerCreate /></Route>
        </Paper>
        {/* <Footer title="Footer" description="Something here to give the footer a purpose!" /> */}
      </div>
    </Route>

    <Route path="/cpanel" render={({ match: { url } }) => {
      return isLoggedIn() ?
        <ControlPanel handleSnackbar={handleSnackbar} handleLogout={handleLogout}>
          <Route path={url} exact><Dashboard handleLogout={handleLogout} handleSnackbar={handleSnackbar} /></Route>
          <Route path={`${url}/week-days`}><WeekDays /></Route>
          <Route path={`${url}/calendar`}><Calendar /></Route>
          <Route path={`${url}/users`} exact><Users handleSnackbar={handleSnackbar} /></Route>
          <Route path={`${url}/company`} exact><Company handleSnackbar={handleSnackbar} /></Route>
          <Route path={`${url}/profile`}><Profile handleSnackbar={handleSnackbar} /></Route>
          <Route path={`${url}/user/:id`}><Profile handleSnackbar={handleSnackbar} /></Route>
          <Route path={`${url}/signings`}>
            <Events
              handleSnackbar={handleSnackbar}
              tableConfig={{
                name: true,
                difference: true,
                canDelete: true,
                canEdit: true,
                datesFormat: 'DD/MM/YYYY HH:mm:ss',
                filters: {
                  types: [5]
                }
              }}
              calendarDialogConfig={{
                startEditable: true,
                endEditable: true,
                // eventEditable: false,
                stateEditable: false,
                stateSelector: true,
                typeEditable: false,
                types: [5],
                datePickerFormat: 'dd/MM/yyyy HH:mm:ss'
              }}
            />
          </Route>
          <Route path={`${url}/events`}>
            <Events
              handleSnackbar={handleSnackbar}
              tableConfig={{
                name: true,
                difference: false,
                canDelete: true,
                canEdit: true,
                datesFormat: 'DD/MM/YYYY',
                filters: {
                  types: [1, 2, 3, 4]
                }
              }}
              calendarDialogConfig={{
                startEditable: true,
                endEditable: true,
                // eventEditable: true,
                stateEditable: true,
                stateSelector: true,
                typeEditable: true,
                types: [1, 2, 3, 4],
                datePickerFormat: 'dd/MM/yyyy'
              }}
            />
          </Route>
        </ControlPanel>
        : <Redirect to="/login" />
    }} />
  </>
})