import React from 'react'

export default function Register({ onSubmit, goToLogin }) {

    function handleRegisterSubmission(event) {
        event.preventDefault()

        const { name, surname, email, password } = event.target

        onSubmit(name.value, surname.value, email.value, password.value)
    }

    return (
        <form onSubmit={handleRegisterSubmission}>
            <input type="text" name="name" placeholder="Name" defaultValue="abc" /><br />
            <input type="text" name="surname" placeholder="Surname" defaultValue="abc" /><br />
            <input type="email" name="email" placeholder="E-mail" defaultValue="abc@abc.abc" /><br />
            <input type="password" name="password" placeholder="Password" defaultValue="abc" /><br />
            <button>Register</button>
            <div>Already registered?&nbsp;<a href="/" onClick={(event) => {
                event.preventDefault()
                goToLogin()
            }}>Login</a></div>
        </form>
    )
}