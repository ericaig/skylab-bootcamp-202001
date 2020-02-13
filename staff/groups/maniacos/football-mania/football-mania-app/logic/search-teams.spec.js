fdescribe('searchTeams', () => {
    let name, surname, age, city, username, password, token, ids, index, query

    const queryIds = ["133740", "133727", "133735", "133733", "133734", "133739", "133937","133735", "133740", "133724", "133722", "133937", "134626", "134701"]
   
    beforeEach(() => {
        name = 'name-' + Math.random()
        surname = 'surname-' + Math.random()
        age = "age-" + Math.random()
        city = "city-" + Math.random()
        username = 'username-' + Math.random()
        password = 'password-' + Math.random()

        index = Math.floor(Math.random()*21)
        query = queryIds[index]
    
       
        //query = Object.keys(queryIds).random()
        //ids = queryIds[query]
    })

    describe('when user already exists', () => {
        beforeEach(done =>{
        
            call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, age, city, username, password })
            }, (error, response) => {
                if (error) return done(error)

                if (response.content) {
                    const { error } = JSON.parse(response.content)

                    if (error) return done(new Error(error))
                }

                call(`https://skylabcoders.herokuapp.com/api/v2/users/auth`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                }, (error, response) => {
                    if (error) return done(error)

                    const { error: _error, token: _token } = JSON.parse(response.content)

                    if (_error) return done(new Error(_error))

                    token = _token

                    done()
                })
            })}
        )

        it('should get results on matching ids but no favorites if not previously added', done => {
            
            searchTeams(token, query, (error, teams) => {
                expect(error).toBeUndefined()
                
                expect(teams).toBeDefined()
                expect(teams.length).toBeGreaterThan(0)

                teams.forEach(team => {
                    expect(typeof team[idTeam]).toBe('string')
                    expect(typeof team[strStadium]).toBe('string')
                    expect(typeof team[strAlternate]).toBe('string')
                    expect(typeof team[strTeamBadge]).toBe('string')
                    expect(typeof team[isFavorited]).toBeFalsy()
                    
                })
                 
                done()
            })
        })

        it('should succeed on non-matching query returning an empty array', done => {
            debugger
            searchTeams(token, 'asdasdfñlajsfklasldñkfjañlsjflasjflasjfñladjs', (error, results) => {
                expect(error).toBeUndefined()

                expect(results).toBeDefined()
                expect(results).toHaveLength(0)

                done()
            })
        })
    })
})

//         describe('when fav vehicles already exists', () => {
//             beforeEach(done => {
//                 const favs = [ids.random(), ids.random(), ids.random()]

//                 call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
//                     method: 'PATCH',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${token}`
//                     },
//                     body: JSON.stringify({ favs })
//                 }, (error, response) => {
//                     if (error) return done(error)

//                     if (response.content) {
//                         const { error } = JSON.parse(response.content)

//                         if (error) return done(new Error(error))
//                     }

//                     done()
//                 })
//             })

//             it('should get results on matching query with favs as previously added', done => {
//                 searchTeams(token, query, (error, teams) => {
//                     expect(error).toBeUndefined()

//                     expect(teams).toBeDefined()
//                     expect(teams.length).toBe(1)

//                     call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`
//                         }
//                     }, (error, response) => {
//                         if (error) return done(error)

//                         // retrieve user to check fav has been removed

//                         const user = JSON.parse(response.content), { error: _error } = user

//                         if (_error) return done(new Error(_error))

//                         const { favs } = user

//                         for (const fav of favs)
// -                            expect(ids).toContain(fav)

//                         //vehicles.forEach(vehicle => {
//                             expect(typeof teams.idTeam).toBe('string')
//                             expect(typeof teams.strStadium).toBe('string')
//                             expect(typeof teams.strAlternate).toBe('string')
//                             expect(typeof teams.strTeamBadge).toBe('string')
//                             expect(typeof teams.isFavorited).toBe('boolean')

//                             expect(teams.isFavorited).toBe(favs.includes(teams.id))
//                         //})

//                         done()
//                     })
//                 })
//             })
//         })

//         it('should fail on invalid token', done => {
//             searchTeams(`${token}-wrong`, query, error => {
//                 expect(error).toBeInstanceOf(Error)
//                 expect(error.message).toBe('invalid token')

//                 done()
//             })
//         })

//         afterEach(done => {
//             call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify({ password })
//             }, (error, response) => {
//                 if (error) return done(error)

//                 if (response.content) {
//                     const { error } = JSON.parse(response.content)

//                     if (error) return done(new Error(error))
//                 }

//                 done()
//             })
//         })
//     })

//     it('should fail on non-string query', () => {
//         token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTNiZDhmZDE3YjgwOTFiYWFjMTIxMzgiLCJpYXQiOjE1ODA5ODA3NjEsImV4cCI6MTU4MDk4NDM2MX0.t8g49qXznSCYiK040NvOWHPXWqnj9riJ_6MD2vwIv3M'

//         expect(() =>
//             searchTeams(token, undefined, () => { })
//         ).toThrowError(TypeError, 'undefined is not a string')

//         expect(() =>
//             searchTeams(token, 1, () => { })
//         ).toThrowError(TypeError, '1 is not a string')

//         expect(() =>
//             searchTeams(token, true, () => { })
//         ).toThrowError(TypeError, 'true is not a string')

//         expect(() =>
//             searchTeams(token, {}, () => { })
//         ).toThrowError(TypeError, '[object Object] is not a string')
//     })

//     it('should fail on non-function callback', () => {
//         token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTNiZDhmZDE3YjgwOTFiYWFjMTIxMzgiLCJpYXQiOjE1ODA5ODA3NjEsImV4cCI6MTU4MDk4NDM2MX0.t8g49qXznSCYiK040NvOWHPXWqnj9riJ_6MD2vwIv3M'

//         expect(() =>
//             searchTeams(token, query, undefined)
//         ).toThrowError(TypeError, 'undefined is not a function')

//         expect(() =>
//             searchTeams(token, query, 1)
//         ).toThrowError(TypeError, '1 is not a function')

//         expect(() =>
//             searchTeams(token, query, true)
//         ).toThrowError(TypeError, 'true is not a function')

//         expect(() =>
//             searchTeams(token, query, {})
//         ).toThrowError(TypeError, '[object Object] is not a function')
//     })
// })