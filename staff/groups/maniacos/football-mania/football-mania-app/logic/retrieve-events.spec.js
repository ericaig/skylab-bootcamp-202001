describe("retrieveEvents", ()=>{
    let teamId

    beforeEach(()=>{
        teamId = "teamId-" + Math.random()

    })
    it("should succed on correct teamId", done =>
        retrieveEvents(teamId, (error, events)=>{
            expect(error).toBeUndefined()
            expect(events).toBeDefined()

            done()
        })
    )

    it("should fail on invalid teamId type", ()=>{
        teamId = 1
        expect(()=>
            retrieveEvents(teamId, ()=> {})
            ).toThrowError(TypeError, `${teamId} is not a string`)

        teamId = true
        expect(()=>
            retrieveEvents(teamId, ()=>{})
            ).toThrowError(TypeError, `${teamId} is not a string`)

        teamId = undefined
        expect(()=>
            retrieveEvents(teamId, ()=>{})
            ).toThrowError(TypeError, `${teamId} is not a string`)

        teamId = []
        expect(()=>
            retrieveEvents(teamId, ()=>{})
            ).toThrowError(TypeError, `${teamId} is not a string`)

        teamId = {}
        expect(()=>
            retrieveEvents(teamId, ()=>{})
            ).toThrowError(TypeError, `${teamId} is not a string`)


    })

    it("should fail on non-function callback", ()=>{
        teamId = "dkg88e9"
        callback = 1
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError, `${callback} is not a function`)

        callback = true
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError, `${callback} is not a function`)

        callback = undefined
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError, `${callback} is not a function`)
    })
})