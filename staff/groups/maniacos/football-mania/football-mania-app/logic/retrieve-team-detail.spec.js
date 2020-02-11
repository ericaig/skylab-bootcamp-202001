describe('retrieveTeamDetail', () => {
    it('should fail on non-string teamId', () => {
        expect(() => retrieveTeamDetail(1, () => { })).toThrowError(TypeError, '1 is not a string')
        expect(() => retrieveTeamDetail(true, () => { })).toThrowError(TypeError, 'true is not a string')
        expect(() => retrieveTeamDetail(null, () => { })).toThrowError(TypeError, 'null is not a string')
        expect(() => retrieveTeamDetail(undefined, () => { })).toThrowError(TypeError, 'undefined is not a string')
        expect(() => retrieveTeamDetail({}, () => { })).toThrowError(TypeError, '[object Object] is not a string')
    })

    it('should fail on empty teamId', () => {
        expect(() => retrieveTeamDetail('', () => { })).toThrowError(Error, 'teamId is empty')
    })

    it('should fail on non-string teamId', () => {
        expect(() => retrieveTeamDetail('12345', 1)).toThrowError(TypeError, '1 is not a function')
        expect(() => retrieveTeamDetail('12345', true)).toThrowError(TypeError, 'true is not a function')
        expect(() => retrieveTeamDetail('12345', null)).toThrowError(TypeError, 'null is not a function')
        expect(() => retrieveTeamDetail('12345', undefined)).toThrowError(TypeError, 'undefined is not a function')
        expect(() => retrieveTeamDetail('12345', {})).toThrowError(TypeError, '[object Object] is not a function')
    })

    it('should return an object containing FC Barcelona infos', (done) => {
        retrieveTeamDetail('133739', (error, team) => {
            expect(error).toBeUndefined()
            expect(team).toBeDefined()
            expect(team.strAlternate).toBeDefined()
            expect(team.strAlternate).toBe('FC Barcelona')

            done()
        })
    })

    it('should fail if teamId is not a La Liga team', (done) => {
        retrieveTeamDetail('133604', (error, team) => { // Arsenal
            expect(error).toBeUndefined()
            expect(team).toBeUndefined()

            done()
        })
    })

    it('should fail on invalid team id', (done) => {
        retrieveTeamDetail('NOT_A_VALID_TEAM_ID', (error, team) => {
            expect(error).toBeUndefined()
            expect(team).toBeUndefined()

            done()
        })
    })
})