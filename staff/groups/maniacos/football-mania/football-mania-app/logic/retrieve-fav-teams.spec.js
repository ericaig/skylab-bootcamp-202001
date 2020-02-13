describe("retrieveFavTeams", () => {
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
        it("should return an object", (done)=>{
            retrieveFavTeams(token, (error, response)=> {
            
                expect(error).toBeUndefined()
                expect(response).toBeDefined()
                
                expect(typeof response).toBe("object")
                expect(typeof response.teams[0]).toBe("object")

                response.teams.forEach(element => {
                    expect(typeof element).toBe("object")
                })
                
                expect(response.teams.constructor.name).toBe("Array")
                expect(response.favoriteTeams.constructor.name).toBe("Array")
                

                done()
            })
        })

        it("should fail in non-function callback", ()=>{
            callback = 1
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            callback = true
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            callback = undefined
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            callback = []
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            callback = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            callback = {}
            expect(()=>
                retrieveFavTeams(token, callback)).toThrowError(TypeError, `${callback} is not a function`)
            
        })
            
        

    })
})

