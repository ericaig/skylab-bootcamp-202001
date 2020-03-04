import React, { useState, Fragment } from 'react'
import Register from './register-user'
import {registerUser} from '../logic'


function App() {
  const [view, setView] = useState('register')

  const handleRegister = (name, surname, email, password) => {
    registerUser(name, surname, email, password)
      .then(() => {
        setView('login')
      })
  }

  return <Fragment>
    {view === 'register' && <Register onSubmit={handleRegister} />}
  </Fragment>
}

export default App
