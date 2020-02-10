function Profile({ onSubmit, user }) {
    return <form className="profile" onSubmit={(event) => {
        event.preventDefault()
        const name = event.target.name.value
        const surname = event.target.surname.value
        const age = event.target.age.value
        const city = event.target.city.value
        const username = event.target.username.value
        const oldPassword = event.target.oldPassword.value
        const password = event.target.password.value

        const newUser = { name, surname, age, city, username, oldPassword, password }
        onSubmit(newUser)
    }}>

        < h3 > Profile</h3 >
        <input type="text" name="name" defaultValue={user.name} />
        <input type="text" name="surname" defaultValue={user.surname} />
        <input type="text" name="age" defaultValue={user.age} />
        <input type="text" name="city" defaultValue={user.city} />
        <input type="text" name="username" defaultValue={user.username} />
        <input type="password" name="oldPassword" placeholder="Enter your old password" />
        <input type="password" name="password" placeholder="Enter your new password" />
        <button>Update your Profile</button>

    </form>
}