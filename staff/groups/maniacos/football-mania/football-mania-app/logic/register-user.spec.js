describe('registerUser', () => {
    let name, surname, age, city, username, password

    beforeEach(() => {
        name = 'name-' + Math.random()
        surname = 'surname-' + Math.random()
        age = "age-" + Math.random()
        city = "city-" + Math.random()
        username = 'username-' + Math.random()
        password = 'password-' + Math.random()
    })

    it('should succeed on new user', done => {
        registerUser(name, surname, age, city, username, password, (error, response) => {
            expect(error).toBeUndefined()

            expect(response).toBeUndefined()

            done()
        })
    })

        describe('when user already exists', () => {
            beforeEach(done => {
                call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, surname, username, password, flag: 'football-mania-app' })
                }, error => {
                    if (error) return done(error)

                    done()
                })
            })

            it('should fail on already existing user', done => {
                registerUser(name, surname, age, city, username, password, error => {
                    expect(error).toBeDefined()
                    expect(error.message).toBe(`user with username "${username}" already exists`)

                    done()
                })
            })
        

            afterEach(done => {
                call(`https://skylabcoders.herokuapp.com/api/v2/users/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                }, (error, response) => {
                    
                    if (error) return done(error)

                    const { error: _error, token } = JSON.parse(response.content)

                    if (_error) return done(new Error(_error))

                    call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ password })
                    }, (error, response) => {
                        if (error) return done(error)

                        if (response.content) {
                            const { error } = JSON.parse(response.content)

                            if (error) return done(new Error(error))
                        }

                        done()
                    })
                })
            })
        })

    it("should fail on non-string name", ()=>{
        name = 1
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)

        name = true
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)

        name = undefined
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)

        name = {}
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)

        name = []
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)

        name = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=>
            registerUser(name, surname, age, city, username, password, ()=>{})
            ).toThrowError(TypeError, `${name} is not a string`)
    })

    it("should fail on non-string surname",()=> {
        surname = 1
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
        surname = true
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
        surname = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
        surname = {}
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
        surname = []
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
        surname = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${surname} is not a string`)
    })
    
    it("should fail on non-string age",()=> {
        age = 1
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
        age = true
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
        age = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
        age = {}
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
        age = []
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
        age = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${age} is not a string`)
    })

    it("should fail on non-string city",()=> {
        city = 1
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
        city = true
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
        city = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
        city = {}
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
        city = []
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
        city = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${city} is not a string`)
    })

    it("should fail on non-string username",()=> {
        username = 1
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
        username = true
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
        username = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
        username = {}
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
        username = []
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
        username = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${username} is not a string`)
    })

    it("should fail on non-string password",()=> {
        password = 1
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
        password = true
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
        password = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
        password = {}
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
        password = []
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
        password = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, ()=>{})).toThrowError(TypeError, `${password} is not a string`)
    })

    it("should fail on non-function callback",()=> {
        callback = 1
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
        callback = true
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
        callback = undefined
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
        callback = {}
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
        callback = []
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
        callback = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/
        expect(()=> registerUser(name, surname, age, city, username, password, callback)).toThrowError(TypeError, `${callback} is not a function`)
    })
})
