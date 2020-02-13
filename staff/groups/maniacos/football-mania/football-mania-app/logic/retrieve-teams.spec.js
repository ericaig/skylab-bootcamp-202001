describe("retrieveTeams", () => {
    let name, surname, age, city, username, password, token

    beforeEach(() => {
        name = "name-" + Math.random()
        surname = "surname-" + Math.random()
        age = "age-" + Math.random()
        city = "city-" + Math.random()
        username = "username-" + Math.random()
        password = "password-" + Math.random()
    })


    describe("when user already exist", () => {
        beforeEach(done => {
            call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, username, password, flag: 'football-mania-app' })
            }, (error, response)  => {
                if (error) return done(error)

                if (response.content) {
                    const {error} = JSON.parse(response.content)
                    if (error) done(new Error(error))
                }

                call(`https://skylabcoders.herokuapp.com/api/v2/users/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({username, password })
                }, (error, response) => {
                    if (error) return done(error)

                    if (response.status !== 200) {
                        const { error } = JSON.parse(response.content)

                        if (error) return done(new Error(error))
                    }

                    const {token: _token} = JSON.parse(response.content)

                    token = _token

                    done()
                })
            })
        })
        it("should return an array", (done)=>{
            retrieveTeams(token, (error, response)=> {
            
                expect(error).toBeUndefined()
                expect(response).toBeDefined()
                expect(response.length).toBeGreaterThan(0)
                expect(response.length).toBe(20)
                expect(typeof response[0].idTeam).toBe("string")
                expect(typeof response[0].strStadium).toBe("string")
                expect(typeof response[0].strAlternate).toBe("string")
                expect(typeof response[0].strTeamBadge).toBe("string")
                expect(typeof response[0].isFavorited).toBe("boolean")

                done()
            })
        })
            
        

    })
})

