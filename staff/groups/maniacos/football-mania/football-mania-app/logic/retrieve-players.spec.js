describe("retrievePlayers test", () => {

    let index

    beforeEach(done=>{
        const teams = {strTeam: "Villarreal", strSport: "Soccer"}
        index = Math.floor(Math.random() * teams.strTeam.length)

        done()
    })

    it("should the function return an array of players", (done) => {
        const teams = {strTeam: "Villarreal"}
        retrievePlayers(teams.strTeam, (error, players) => {
            expect(error).toBeUndefined()
            expect(players).toBeDefined()
            expect(players instanceof Array).toBe(true)

            done()
        })
    })

    it("should all players have to be from Villarreal team", (done) => {
        const teams = {strTeam: "Villarreal"}
        retrievePlayers(teams.strTeam, (error, players) => {
            expect(error).toBeUndefined()
            expect(players[index].strTeam).toBe("Villarreal")

            done()
        })
    })

    it("should all players have to be Soccer players", (done) => {
        const teams = {strTeam: "Villarreal", strSport: "Soccer"}
        retrievePlayers(teams.strSport, (error, players) => {
            expect(error).toBeUndefined()
            expect(players[index].strSport).toBe("Soccer")

            done()
        })
    })
    
    it("should fail on non-string team name", ()=>{
        expect(() => retrievePlayers(1, () => { })).toThrowError(TypeError, '1 is not a string')
        expect(() => retrievePlayers(undefined, () => { })).toThrowError(TypeError, 'undefined is not a string')
        expect(() => retrievePlayers(null, () => { })).toThrowError(TypeError, 'null is not a string')
        expect(() => retrievePlayers(true, () => { })).toThrowError(TypeError, 'true is not a string')
        expect(() => retrievePlayers(false, () => { })).toThrowError(TypeError, 'false is not a string')
        expect(() => retrievePlayers({}, () => { })).toThrowError(TypeError, '[object Object] is not a string')
    })

    it("should fail on empty team name", ()=>{
        expect(() => retrievePlayers("", () => { })).toThrowError(Error, 'team name is empty')
    })

    it("should fail on non-function expression", ()=>{
        expect(() => retrievePlayers('Barcelona', 1)).toThrowError(TypeError, '1 is not a function')
        expect(() => retrievePlayers('Barcelona', true)).toThrowError(TypeError, 'true is not a function')
        expect(() => retrievePlayers('Barcelona', null)).toThrowError(TypeError, 'null is not a function')
        expect(() => retrievePlayers('Barcelona', undefined)).toThrowError(TypeError, 'undefined is not a function')
        expect(() => retrievePlayers('Barcelona', {})).toThrowError(TypeError, '[object Object] is not a function')
    })
})
