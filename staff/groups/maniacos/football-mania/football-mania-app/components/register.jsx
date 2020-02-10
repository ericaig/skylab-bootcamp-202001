function Register({onToSubmit}){
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
        <h2>Register</h2>
        <input type="text" name="name" placeholder="enter your name"/>
        <input type="text" name="surname" placeholder="enter your surname"/>
        <input type="text" name="age" placeholder="enter your age"/>
        <input type="text" name="city" placeholder="enter your city"/>
        <input type="text" name="username" placeholder="enter your username"/>
        <input type="password" name="password" placeholder="enter your password"/>
        <button>Register</button>

    </form>
        
    
}