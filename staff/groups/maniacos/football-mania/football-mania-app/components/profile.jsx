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

        <section className="profile__container">
            < h3 className="profile__title" > Profile</h3 >
            <input className="profile__name" type="text" name="name" defaultValue={user.name} />
            <input className="profile__surname" type="text" name="surname" defaultValue={user.surname} />
            <input className="profile__age" type="text" name="age" defaultValue={user.age} />
            <input className="profile__city" type="text" name="city" defaultValue={user.city} />
            <input className="profile__username" type="text" name="username" defaultValue={user.username} />
            <input className="profile__old-password" type="password" name="oldPassword" placeholder="Enter your old password" />
            <input className="profile__password" type="password" name="password" placeholder="Enter your new password" />
            <button className="profile__button">Update your Profile</button>
        </section>
    </form>
}