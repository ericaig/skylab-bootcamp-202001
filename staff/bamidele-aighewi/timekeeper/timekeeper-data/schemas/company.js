const { Schema, SchemaTypes: { ObjectId} } = require('mongoose')

/**
 * @param {String} owner - Owner of the company
 * @param {String} name - The company's name
 * @param {String} nif - The company's fiscal identification number
 * @param {String} postalCode - The company's postal code
 * @param {String} city - The city the company is situated
 * @param {String} address - The company's address
 * @param {String} web - The company's homepage URL
 * @param {String} startTime - The company's work start time
 * @param {String} endTime - The company's work end time
 * @param {String} createdAt - Date and time the company was created
 * @param {String} updatedAt - Date and time the company was updated
 */
module.exports = new Schema({
    owner: { type: ObjectId, required: [true, "Owner ID is required"], ref: 'User' },
    name: { type: String, required: [true, "Name is required"] },
    nif: { type: String, required: [true, "NIF is required"] },
    invite: { type: String },
    email: {
        type: String,
        // unique: true,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
            'Please enter a valid email address'
        ],
        required: [true, 'E-mail is required']
    },
    postalCode: { type: String, required: [true, "Postal code is required"] },
    city: { type: String, required: [true, "City is required"] },
    address: { type: String },
    web: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date }
})