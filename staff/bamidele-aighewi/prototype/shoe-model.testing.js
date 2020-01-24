describe('shoe-model', function () {
    it('should initialize model', function () {
        assert(typeof ShoeModel === 'function', ShoeModel + ' is not a function. ')
    });

    it('should have correct properties', function () {
        var allowedKeys = [
            "id",
            "name",
            "price",
            "category",
            "inStock",
            "size",
            "color"
        ];

        var model = new ShoeModel(1, "Name", 22.50, "Category A", true, 41, 'blue');
        var modelKeys = Object.keys(model);

        assert(allowedKeys.length === modelKeys.length, 'Model does not have the same amount of allowed keys / properties')

        for (var x = 0; x < allowedKeys.length; x++) {
            var key = allowedKeys[x];
            assert(modelKeys.indexOf(key) !== -1, 'Model should have key "' + key + '"')
        }
    })

    it('should fail on incorrect Data Types', function () {
        (function () {
            // test size param
            new ShoeModel(false, "Name", 22.50, "Category A", true, false, "blue");
        })();

        (function () {
            // test color param
            new ShoeModel(1, false, 22.50, "Category A", true, 41, false);
        })();
    })
})