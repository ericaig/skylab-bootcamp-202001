describe("retrieveEvents", ()=>{
    beforeEach(()=>{

    })

    it("should fail on invalid teamId type", ()=>{
        teamId = 1
        expect(()=>
            retrieveEvents(teamId, ()=> {})).toThrowError(TypeError `teamId ${teamId} is not a string`)
        teamId = true
        expectF(teamId).toThrowError(TypeError `teamId ${teamId} is not a string`)
        teamId = undefined
        expect(teamId).toThrowError(TypeError `teamId ${teamId} is not a string`)
    })

    it("should fail on non-function callback", ()=>{
        teamId = "dkg88e9"
        callback = 1
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError, `callback ${callback} is not a function`)

        callback = true
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError `callback ${callback} is not a function`)

        callback = undefined
        expect(()=>
            retrieveEvents(teamId, callback)).toThrowError(TypeError, `callback ${callback} is not a function`)
    })
})