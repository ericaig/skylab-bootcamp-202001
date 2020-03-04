import React from 'react'

const Register = ({ onSubmit, onToLogin }) => {

    function handleOnSubmit(event) {
        event.preventDefault()

        const { name, surname, email, password } = event.target
        onSubmit(name.value, surname.value, email.value, password.value)
    }
    function handleGoToLogin(event) {
        event.preventDefault()
        onToLogin()
    }

    return <form className="register" onSubmit={handleOnSubmit}>
        <h2 className="register__title">Sign-Up</h2>
        <input className="register__input" type="text" placeholder="name" name="name" />
        <input className="register__input" type="text" placeholder="surname" name="surname" />
        <input className="register__input" type="text" placeholder="email" name="email" />
        <input className="register__input" type="password" placeholder="password" name="password" />

        <button className="register__submit">Submit</button>
        <a className="register__login" href="" onClick={handleGoToLogin}>Sign-In</a>
    </form>

}

export default Register