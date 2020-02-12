function Login({ onLogin, onGoToRegister }) {
    return <form className="login" onSubmit={(event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        onLogin(username, password)
    }}>
        <section className="login__logo"></section>
        <section className="login__container">
            <h2 className="login__title">LOGIN</h2>
            <input className="login__username" type="text" name="username" placeholder="username" autoComplete="off" />
            <input className="login__password" type="password" name="password" placeholder="password" />
            <button className="login__button">OK</button><br></br>
            <a className="login__anchor" href="" onClick={event=>{
                event.preventDefault()
                onGoToRegister()
            }}>Don't you have an account? REGISTER</a>
        </section>
    </form>
}