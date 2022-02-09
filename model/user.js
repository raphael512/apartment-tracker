const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email : { type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: { type: String, required: true},
    lastName: { type: String, required: true}

}, {collection: 'UserData'})

const model = mongoose.model('UserSchema', userSchema)

module.exports = model