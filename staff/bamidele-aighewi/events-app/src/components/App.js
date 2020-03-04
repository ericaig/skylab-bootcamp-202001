import React, { useState } from 'react'

// import './App.css'
import './App.sass'
import Register from './Register'
import Login from './Login'
import { registerUser, authenticateUser, retrieveUser } from '../logic'
// import { sayHello } from '../logic'

function App() {
  const [view, setView] = useState('login')

  // const changeView = view => setView(view)

  const handleRegister = (name, surname, email, password) => {
    try {
      registerUser(name, surname, email, password)
        .then(() => {
          setView('login')
        })
        .catch(error => {
          console.log(error.message)

        })
    }
    catch (error) {
      console.log(error.message)
    }
  }

  const handleLogin = (email, password) => {
    try {
      authenticateUser(email, password).then(token => {
        retrieveUser(token).then(user=>{
          console.log(user)
        }).catch(error=>{
          console.log(error.message)
        })
      }).catch(error => {
        console.log(error.message)
      })
    } catch (error) {
      console.log(error.message)

    }
  }

  return <div className="App">
    {view === 'register' && <Register onSubmit={handleRegister} goToLogin={() => { setView('login') }} />}
    {view === 'login' && <Login onSubmit={handleLogin} goToRegister={() => { setView('register') }} />}
  </div>
}

export default App
