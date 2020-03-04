import React from 'react'

const Register = ({ onSubmit }) => {

    function handleOnSubmit(event) {
        event.preventDefault()

        const { name, surname, email, password } = event.target
        onSubmit(name.value, surname.value, email.value, password.value)

    }

    return (
        <form onSubmit={handleOnSubmit}>
            <input type='text' name='name' placeholder='name'></input>
            <input type='text' name='surname' placeholder='surname'></input>
            <input type='text' name='email' placeholder='email@mail.com'></input>
            <input type='password' name='password' placeholder='password'></input>
            <button>Register</button>
        </form>
    )

}

export default Register