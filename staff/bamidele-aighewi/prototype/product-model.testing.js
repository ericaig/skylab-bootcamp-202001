describe('product-model', function () {
    it('should initialize model', function () {
        assert(typeof ProductModel === 'function', 'expects "ProductModel" to be a function but ' + (typeof ProductModel) + ' given')
    });

    it('should have correct properties', function () {
        var allowedKeys = [
            "id", 
            "name", 
            "price", 
            "category", 
            "inStock"
        ];

        var model = new ProductModel(1, "Name", 22.50, "Category A", true)
        var modelKeys = Object.keys(model)
        //console.log(model.price())

        assert(allowedKeys.length === modelKeys.length, 'Model does not have the same amount of allowed keys / properties')

        for (var x = 0; x < allowedKeys.length; x++) {
            var key = allowedKeys[x];
            assert(modelKeys.indexOf(key) !== -1, 'Model should have key "' + key + '"')
        }
    })

    it('should fail on incorrect Data Types', function () {
        (function () {
            // test id param
            new ProductModel(false, "Name", 22.50, "Category A", true);
        })();

        (function () {
            // test name param
            new ProductModel(1, false, 22.50, "Category A", true);
        })();

        (function () {
            // test price param
            new ProductModel(1, "Name", false, "Category A", true);
        })();

        (function () {
            // test category param
            new ProductModel(1, "Name", 22.50, false, true);
        })();

        (function () {
            // test inStock param
            new ProductModel(1, "Name", 22.50, "Category A", "string");
        })();
    })
})