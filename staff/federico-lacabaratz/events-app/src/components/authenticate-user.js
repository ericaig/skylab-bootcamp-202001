import React from 'react'

const Login = ({ onSubmit, onToRegister }) => {

    function handleOnSubmit(event) {
        event.preventDefault()

        const { email, password } = event.target
        onSubmit(email.value, password.value)
    }
    function handleGoToRegister(event) {
        event.preventDefault()
        onToRegister()
    }

    return <form className="login" onSubmit={handleOnSubmit}>

        <h2 className="login__title">Sign-In</h2>
        <input className="login__input" type="text" placeholder="email" name="email" />
        <input className="login__input" type="password" placeholder="password" name="password" />

        <button className="login__submit">Submit</button>
        <a className="login__register" href="" onClick={handleGoToRegister} >Sign-up</a>
    </form>
}

export default Login