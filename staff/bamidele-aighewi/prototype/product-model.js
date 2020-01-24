'use strict';

function ProductModel(id, name, price, category, inStock) {
    if (typeof id !== 'number') throw new TypeError('id param >> ' + id + ' is not a number. ' + (typeof id) + ' given');
    if (typeof name !== 'string') throw new TypeError('name param >> ' + name + ' is not a string. ' + (typeof name) + ' given');
    if (typeof price !== 'number') throw new TypeError('price param >> ' + price + ' is not a number. ' + (typeof price) + ' given');
    if (typeof category !== 'string') throw new TypeError('category param >> ' + category + ' is not a string. ' + (typeof category) + ' given');
    if (typeof inStock !== 'boolean') throw new TypeError('inStock param >> ' + inStock + ' is not a boolean. ' + (typeof inStock) + ' given');

    this.name = name;
    this.price = price;
    this.category = category;
    this.id = id;
    this.inStock = inStock;
}

/*ProductModel.prototype.getPrice = function(){
    return this.price + ' €'
}*/

Object.defineProperty(ProductModel.prototype, 'name', {
    set(name) {
        this.__name__ = name.toUpperCase()
    },
    get() {
        return this.__name__
    }
})