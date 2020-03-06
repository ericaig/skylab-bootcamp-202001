import React, { useState } from 'react'

// import './App.css'
import './App.sass'
import Register from './Register'
import Login from './Login'
import { registerUser, authenticateUser, retrieveUser, createEvent, retrievePublishedEvents } from '../logic'
// import { sayHello } from '../logic'

function App() {
  const [view, setView] = useState('login')

  // const changeView = view => setView(view)

  const handleRegister = (name, surname, email, password) => {
    (async () => {
      try {
        await registerUser(name, surname, email, password)
        setView('login')
      } catch ({ message }) {
        console.log(message)
      }
    })()
  }

  const handleLogin = (email, password) => {
    (async () => {
      try {
        const token = await authenticateUser(email, password)
        const user = await retrieveUser(token)
        console.log(token)
        console.log(user)
        sessionStorage.setItem('token', token)
      } catch ({ message }) {
        console.log(message)
      }
    })()
  }

  const handleCreateEvent = () => {
    (async () => {
      try {
        const token = sessionStorage.getItem('token')
        const response = await createEvent(token, 'Event from event-app', 'Event-app description', 'Event-app', new Date())
        console.log('create event', response)
      } catch ({ message }) {
        console.log(message)
      }
    })()
  }

  const handleRetrievePublishedEvents = () => {
    (async () => {
      try {
        const token = sessionStorage.getItem('token')
        const events = await retrievePublishedEvents(token)
        console.log(events)
      } catch ({message}) {
        console.log(message)
      }
    })()
  }

  return <div className="App">
    {view === 'register' && <Register onSubmit={handleRegister} goToLogin={() => { setView('login') }} />}
    {view === 'login' && <Login onSubmit={handleLogin} goToRegister={() => { setView('register') }} />}

    <button onClick={handleCreateEvent}>Create event</button>
    <button onClick={handleRetrievePublishedEvents}>Retrieve events</button>
  </div>
}

export default App
