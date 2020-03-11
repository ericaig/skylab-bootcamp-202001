const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const { roles } = require('../utils')

module.exports = new Schema({
    name: { type: String, required: [true, 'Name is required'] },
    surname: { type: String, required: [true, 'Surname is required'] },
    email: {
        type: String,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address'],
        required: [true, 'E-mail is required']
    },
    password: { type: String, required: [true, 'Password is required'] },
    created: { type: Date, required: [true, 'Created field is required'], default: Date.now },
    authenticated: { type: Date },
    retrieved: { type: Date },
    company: { type: ObjectId, ref: 'Company' },
    role: {
        type: Number,
        /**
         * 1 - developer
         * 2 - client
         * 3 - worker
         */
        enum: [roles.DEVELOPER, roles.CLIENT, roles.WORKER],
        required: true
    }
})