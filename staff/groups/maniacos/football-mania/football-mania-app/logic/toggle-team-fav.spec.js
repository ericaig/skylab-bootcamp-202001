describe('toggleTeamFav', () => {
    let name, surname, username, password, token, id
    let ids = ["134221", "134232", "134699", "133817", "133727", "133729", "135456", "133739", "134487"]

    beforeEach(() => {
        
        name = 'name-' + Math.random()
        surname = 'surname-' + Math.random()
        username = 'username-' + Math.random()
        password = 'password-' + Math.random()

        id = ids[Math.floor(Math.random() * ids.length)]
    })

    describe('when user already exists', () => {
        beforeEach(done =>
            call(`https://skylabcoders.herokuapp.com/api/v2/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, surname, username, password })
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
            })
        )

        it('should add a team id when it was not previously there', done =>
            toggleTeamFav(id, token, error => {
                expect(error).toBeUndefined()

                call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }, (error, response) => {
                    if (error) return done(error)

                    // retrieve user to check fav has been added

                    const user = JSON.parse(response.content), { error: _error } = user

                    if (_error) return done(new Error(_error))

                    const { favs } = user

                    expect(favs).toContain(id)

                    done()
                })
            })
        )

        describe('when fav team already exists', () => {
            beforeEach(done => {
                const favs = [id]

                call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ favs })
                }, (error, response) => {
                    if (error) return done(error)

                    if (response.content) {
                        const { error } = JSON.parse(response.content)

                        if (error) return done(new Error(error))
                    }

                    done()
                })
            })

            it('should succeed removing a team id when previously added', done => {
                toggleTeamFav(id, token, error => {
                    expect(error).toBeUndefined()

                    call(`https://skylabcoders.herokuapp.com/api/v2/users/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }, (error, response) => {
                        if (error) return done(error)

                        // retrieve user to check fav has been removed

                        const user = JSON.parse(response.content), { error: _error } = user

                        if (_error) return done(new Error(_error))

                        const { favs } = user

                        expect(favs).not.toContain(id)

                        done()
                    })
                })
            })
        })

        it('should fail on invalid token', done => {
            toggleTeamFav(id, `${token}-wrong`, error => {
                expect(error).toBeInstanceOf(Error)
                expect(error.message).toBe('invalid token')

                done()
            })
        })

        afterEach(done => {
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

    it('should fail on non-string token', () => {
        token = 1
        expect(() =>
            toggleTeamFav(id, token, () => { })
        ).toThrowError(TypeError, `token ${token} is not a string`)

        token = true
        expect(() =>
            toggleTeamFav(id, token, () => { })
        ).toThrowError(TypeError, `token ${token} is not a string`)

        token = undefined
        expect(() =>
            toggleTeamFav(id, token, () => { })
        ).toThrowError(TypeError, `token ${token} is not a string`)
    })

    it('should fail on invalid token format', () => {
        token = 'abc'

        expect(() =>
            toggleTeamFav(id, token, () => { })
        ).toThrowError(Error, 'token is invalid')
    })

    it('should fail on non-function callback', () => {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZTNiZDhmZDE3YjgwOTFiYWFjMTIxMzgiLCJpYXQiOjE1ODA5ODA3NjEsImV4cCI6MTU4MDk4NDM2MX0.t8g49qXznSCYiK040NvOWHPXWqnj9riJ_6MD2vwIv3M'

        callback = 1
        expect(() =>
            toggleTeamFav(id, token, callback)
        ).toThrowError(TypeError, `callback ${callback} is not a function`)

        callback = true
        expect(() =>
            toggleTeamFav(id, token, callback)
        ).toThrowError(TypeError, `callback ${callback} is not a function`)

        callback = undefined
        expect(() =>
            toggleTeamFav(id, token, callback)
        ).toThrowError(TypeError, `callback ${callback} is not a function`)
    })
})