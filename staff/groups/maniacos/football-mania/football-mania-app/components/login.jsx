function Login({onLogin}){
    return <form className="login" onSubmit={(event)=>{
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value
        onLogin(username, password)
    }}>
        <h2>Login</h2>
        <input type="text" name="username" placeholder="username"/>
        <input type="password" name="password" placeholder="password"/>
        <button>login</button>

    </form>
      
 
}