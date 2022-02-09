const mongoose = require('mongoose')

const tenantSchema = new mongoose.Schema({
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    gender: { type: String, required: true},
    unitDetails : { type: String, required: true},
    status: {type: String, required: true},
    landlordEmail: {type: String, required: true}

}, {collection: 'TenantData'})

const model = mongoose.model('tenantSchema', tenantSchema)

module.exports = model