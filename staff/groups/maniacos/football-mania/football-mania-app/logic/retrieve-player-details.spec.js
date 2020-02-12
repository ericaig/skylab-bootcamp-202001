describe("retrievePlayerDetails", () => {
    it("should the function return an array with player details", (done) => {
        const teams = {strTeam: "Barcelona", strPlayer:"Messi"}
        retrievePlayerDetails(teams.strTeam, teams.strPlayer, (error, player) => {
            expect(error).toBeUndefined()
            expect(player).toBeDefined()
            expect(player instanceof Array).toBe(true)

            done()
        })
    })

    it("should the function return an array of objects", (done) => {
        const teams = {strTeam: "Barcelona", strPlayer:"Messi"}
        retrievePlayerDetails(teams.strTeam, teams.strPlayer, (error, player) => {
            expect(error).toBeUndefined()
            expect(player[0] instanceof Object).toBe(true)

            done()
        })
    })

    it("should fail on non-string team name", ()=>{
        expect(() => retrievePlayerDetails(1, "Messi", () => { })).toThrowError(TypeError, '1 is not a string')
        expect(() => retrievePlayerDetails(undefined, "Messi", () => { })).toThrowError(TypeError, 'undefined is not a string')
        expect(() => retrievePlayerDetails(null, "Messi", () => { })).toThrowError(TypeError, 'null is not a string')
        expect(() => retrievePlayerDetails(true, "Messi", () => { })).toThrowError(TypeError, 'true is not a string')
        expect(() => retrievePlayerDetails(false, "Messi", () => { })).toThrowError(TypeError, 'false is not a string')
        expect(() => retrievePlayerDetails({}, "Messi", () => { })).toThrowError(TypeError, '[object Object] is not a string')
    })

    it("should fail on non-string player name", ()=>{
        expect(() => retrievePlayerDetails('Barcelona', 1, () => { })).toThrowError(TypeError, '1 is not a string')
        expect(() => retrievePlayerDetails('Barcelona', undefined, () => { })).toThrowError(TypeError, 'undefined is not a string')
        expect(() => retrievePlayerDetails('Barcelona', null, () => { })).toThrowError(TypeError, 'null is not a string')
        expect(() => retrievePlayerDetails('Barcelona', true, () => { })).toThrowError(TypeError, 'true is not a string')
        expect(() => retrievePlayerDetails('Barcelona', false, () => { })).toThrowError(TypeError, 'false is not a string')
        expect(() => retrievePlayerDetails('Barcelona', {}, () => { })).toThrowError(TypeError, '[object Object] is not a string')
    })

    it("should fail on empty team name", ()=>{
        expect(() => retrievePlayerDetails("", "Messi", () => { })).toThrowError(Error, 'team name is empty')
    })

    it("should fail on empty player name", ()=>{
        expect(() => retrievePlayerDetails("Barcelona", "", () => { })).toThrowError(Error, 'player name is empty')
    })

    it("should fail on non-function expression", ()=>{
        expect(() => retrievePlayerDetails('Barcelona', "Messi", 1)).toThrowError(TypeError, '1 is not a function')
        expect(() => retrievePlayerDetails('Barcelona', "Messi", true)).toThrowError(TypeError, 'true is not a function')
        expect(() => retrievePlayerDetails('Barcelona', "Messi", null)).toThrowError(TypeError, 'null is not a function')
        expect(() => retrievePlayerDetails('Barcelona', "Messi", undefined)).toThrowError(TypeError, 'undefined is not a function')
        expect(() => retrievePlayerDetails('Barcelona', "Messi", {})).toThrowError(TypeError, '[object Object] is not a function')
    })
})