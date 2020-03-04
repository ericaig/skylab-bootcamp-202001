import React, { useState, Fragment } from 'react'
import Register from './register-user'
import Login from './authenticate-user'
import Home from './home'
import { registerUser, authenticateUser } from '../logic'


function App() {
  const [view, setView] = useState('login')

  const handleRegister = (name, surname, email, password) => {
    registerUser(name, surname, email, password)
      .then(() => {
        setView('login')
      })
  }

  const handleLogin = (email, password) => {
    authenticateUser(email, password)
      .then(() => {
        setView('home')
      })
  }
  const handleGoToRegister = () => {
    setView('register')
  }

  const handleGoToLogin = () => {
    setView('login')
  }


return <Fragment>
  {view === 'register' && <Register onSubmit={handleRegister} onToLogin={handleGoToLogin} />}
  {view === 'login' && <Login onSubmit={handleLogin} onToRegister={handleGoToRegister} />}
  {view === 'home' && <Home />}
</Fragment>

}

export default App
