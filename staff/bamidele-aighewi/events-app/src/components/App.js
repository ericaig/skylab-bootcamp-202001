import React, { useState, useEffect } from 'react'

// import './App.css'
import './App.sass'
import Register from './Register'
import Login from './Login'
import Landing from './Landing'
import CreateEvent from './CreateEvent'
import PublishedEvents from './PublishedEvents'
import { registerUser, authenticateUser, retrieveUser, createEvent, retrievePublishedEvents } from '../logic'
// import { sayHello } from '../logic'

function App() {
  const [view, setView] = useState('login')
  const [feedback, setFeedback] = useState()
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({})
  const [publishedEvents, setPublishedEvents] = useState([])

  // set handleToken = token => sessionStorage.setItem('token', token)
  const handleJWToken = token => sessionStorage.setItem('token', token)
  const retrieveJWToken = () => sessionStorage.getItem('token')

  const handleFeedback = (message, type = 'error') => {
    setFeedback({ message, type })
    console.log(`${type.toUpperCase()}: ${message}`)
  }

  const handleRegister = (name, surname, email, password) => {
    (async () => {
      try {
        await registerUser(name, surname, email, password)
        setView('login')
      } catch ({ message }) {
        handleFeedback(message)
      }
    })()
  }

  const handleLoggedInState = (token, user) => {
    setUser(user)
    setLoggedIn(true)
    handleJWToken(token)
    setView('landing')
  }

  const handleLogout = () => {
    setUser()
    setLoggedIn(false)
    setFeedback()
    setPublishedEvents([])
    sessionStorage.clear()
    setView('login')
  }

  const handleLogin = (email, password) => {
    (async () => {
      try {
        const token = await authenticateUser(email, password)
        const user = await retrieveUser(token)
        handleLoggedInState(token, user)
      } catch ({ message }) {
        handleFeedback(message)
      }
    })()
  }

  const handleCreateEvent = (title, description, location, date) => {
    console.log(title, description, location, date)

    ;(async () => {
      try {
        const token = retrieveJWToken()
        date = (date && Date(date)) || ''
        await createEvent(token, title, description, location, date)
        handleFeedback('Successfully created event', 'success')
        handleRetrievePublishedEvents()
      } catch ({ message }) {
        handleFeedback(message)
      }
    })()
  }

  const handleRetrievePublishedEvents = () => {
    (async () => {
      try {
        const token = sessionStorage.getItem('token')
        const events = await retrievePublishedEvents(token)
        console.log(events)
        setPublishedEvents(events)
      } catch ({ message }) {
        handleFeedback(message)
      }
    })()
  }

  const handleDeleteEvent = id =>{
    console.log(id)
  }

  useEffect(() => {
    const token = retrieveJWToken()
    if (token) {
      ; (async () => {
        const user = await retrieveUser(token)
        handleLoggedInState(token, user)
        handleRetrievePublishedEvents()
      })()
    }
  }, [])

  return <div className="App">
    {view === 'register' && <Register onSubmit={handleRegister} goToLogin={() => { setView('login') }} />}
    {view === 'login' && <Login onSubmit={handleLogin} goToRegister={() => { setView('register') }} />}

    {loggedIn &&
      <>
        {/* Logged in pages */}
        {user && <span>Hello, {user.name}</span>}<br />
        <button onClick={handleLogout}>Logout user</button><br />
        {view === 'landing' && <Landing setView={setView} />}
        {view === 'create-event' && <CreateEvent onSubmit={handleCreateEvent} />}
        
        {publishedEvents && <PublishedEvents events={publishedEvents} deleteEvent={handleDeleteEvent} />}
      </>
    }

    {/* <button onClick={handleCreateEvent}>Create event</button>
    <button onClick={handleRetrievePublishedEvents}>Retrieve events</button> */}
  </div>
}

export default App
