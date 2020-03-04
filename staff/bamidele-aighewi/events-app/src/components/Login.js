import React from 'react'
export default

    function Login({ onSubmit, goToRegister }) {

    const handleSubmit = (event) => {
        event.preventDefault()
        const { email, password } = event.target
        onSubmit(email, password)
    }

    return <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="email" />
        <input type="password" name="password" placeholder="password" />
        <button>Login</button>
        <a href="/" onClick={(event) => {
            event.preventDefault()
            goToRegister()
        }}>Go to register</a>
    </form>
}