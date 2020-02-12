function Register({onToSubmit, onGoToLogin}){
    return <form className="register" onSubmit={(event)=>{
                event.preventDefault()
                const name = event.target.name.value
                const surname = event.target.surname.value
                const age = event.target.age.value
                const city = event.target.city.value
                const username = event.target.username.value
                const password = event.target.password.value
                
                onToSubmit(name, surname, age, city, username, password)
    }}>
        <section className="register__logo"></section>
        <section className="register__container">
            <h2 className="register__title">Register</h2>
            <section className="register__container-global">
                <section className="register__container-two">
                    <input className="register__name" type="text" name="name" placeholder="enter your name" autoComplete="off"/>
                    <input className="register__surname" type="text" name="surname" placeholder="enter your surname" autoComplete="off"/>
                    <input className="register__age" type="text" name="age" placeholder="enter your age" autoComplete="off"/>
                    <input className="register__city" type="text" name="city" placeholder="enter your city" autoComplete="off"/>
                </section>
                <section className="register__container-three">
                    <input className="register__username" type="text" name="username" placeholder="enter your username" autoComplete="off"/>
                    <input className="register__password" type="password" name="password" placeholder="enter your password" />
                </section>
            </section>
            <button className="register__button">Register</button>
            <a className="register__anchor" href="" onClick={event=>{
                event.preventDefault()
                onGoToLogin()
            }}>Are you already register? GO TO LOGIN</a>
        </section>
    </form>
        
    
}