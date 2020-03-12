const { Schema, SchemaTypes: { ObjectId } } = require('mongoose')

module.exports = new Schema({
    company: { type: ObjectId, required: [true, 'Company is required'], ref: 'Company' },
    sunday: { type: Boolean, required: [true, 'Sunday field is required'], default: false },
    monday: { type: Boolean, required: [true, 'Monday field is required'], default: true },
    tuesday: { type: Boolean, required: [true, 'Tuesday field is required'], default: true },
    wednesday: { type: Boolean, required: [true, 'Wednesday field is required'], default: true },
    thursday: { type: Boolean, required: [true, 'Thursday field is required'], default: true },
    friday: { type: Boolean, required: [true, 'Friday field is required'], default: true },
    saturday: { type: Boolean, required: [true, 'Saturday field is required'], default: true },

    createdBy: { type: ObjectId, required: [true, 'Created by field is required'], ref: 'User' },
    createdAt: { type: Date, required: [true, 'Created at field is required'], default: Date.now },

    updatedBy: { type: ObjectId, required: [true, 'Created by field is required'], ref: 'User' },
    updatedAt: { type: Date, required: [true, 'Updated by field is required'], default: Date.now }
})