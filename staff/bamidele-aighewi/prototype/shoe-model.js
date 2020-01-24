'use strict';

function ShoeModel(id, name, price, category, inStock, size, color) {
    if (typeof size !== 'number') throw new TypeError('size param >> ' + size + ' is not a number. ' + (typeof size) + ' given');
    if (typeof color !== 'string') throw new TypeError('color param >> ' + color + ' is not a string. ' + (typeof color) + ' given');

    this.size = size;
    this.color = color;
    ProductModel.call(this, id, name, price, category, inStock);
}

/*step 1*/
// this allows ShoeModel to inherit all ProductModel properties / methods
ShoeModel.prototype = Object.create(ProductModel.prototype);

/*step 2*/
// this allows to reassign ShoeModel constructor properties back again, because step 1 kindda unassigns stuffs...
ShoeModel.prototype.constructor = ShoeModel;