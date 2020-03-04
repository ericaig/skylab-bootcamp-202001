import React, { useState } from 'react'

// import './App.css'
import './App.sass'
import Register from './Register'
import Login from './Login'
import { registerUser } from '../logic'
// import { sayHello } from '../logic'

function App() {
  const [view, setView] = useState('register')

  // const changeView = view => setView(view)

  const handleRegister = (name, surname, email, password) => {
    try {
      registerUser(name, surname, email, password)
        .then(() => {
          setView('login')
        })
        .catch(error => {
          console.log(error)

        })
    }
    catch (error) {
      console.log(error)
    }

  }
  const handleLogin = (email, password) => { }

  return <div className="App">
    {view === 'register' && <Register onSubmit={handleRegister} goToLogin={() => { setView('login') }} />}
    {view === 'login' && <Login onSubmit={handleLogin} goToRegister={() => { setView('register') }} />}
  </div>
}

export default App
