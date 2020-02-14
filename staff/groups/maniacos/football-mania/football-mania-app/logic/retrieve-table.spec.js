describe('retrieveTable', () => {
    it('should fail on non-function param', () => {
        expect(() => retrieveTable(1)).toThrowError(TypeError, '1 is not a function')
        expect(() => retrieveTable(true)).toThrowError(TypeError, 'true is not a function')
        expect(() => retrieveTable(null)).toThrowError(TypeError, 'null is not a function')
        expect(() => retrieveTable(undefined)).toThrowError(TypeError, 'undefined is not a function')
        expect(() => retrieveTable({})).toThrowError(TypeError, '[object Object] is not a function')
    })

    it('should return an array containing objects', (done) => {
        retrieveTable((error, table) => {
            expect(error).toBeUndefined()
            expect(table).toBeDefined()
            expect(table.length).toBeGreaterThan(0)
            done()
        })
    })
})