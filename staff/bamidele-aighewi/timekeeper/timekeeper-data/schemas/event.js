const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')
const { eventTypes, eventStates } = require('../utils')

module.exports = new Schema({
    company: { type: ObjectId, required: [true, 'Company is required'], ref: 'Company' },
    user: { type: ObjectId, ref: 'User' },
    start: { type: Date, required: [true, 'Start field is required'] },
    end: { type: Date, required: [true, 'End field is required'] },
    type: {
        type: Number,
        enum: [...Object.values(eventTypes)],
        required: true
    },
    state: {
        type: Number,
        enum: [...Object.values(eventStates)],
        required: true
    },
    description: {type: String, required: [true, 'Event description is required']},

    createdBy: { type: ObjectId, required: [true, 'Created by field is required'], ref: 'User' },
    createdAt: { type: Date, required: [true, 'Created at field is required'], default: Date.now },

    updatedBy: { type: ObjectId, required: [true, 'Created by field is required'], ref: 'User' },
    updatedAt: { type: Date, required: [true, 'Updated by field is required'], default: Date.now }
})