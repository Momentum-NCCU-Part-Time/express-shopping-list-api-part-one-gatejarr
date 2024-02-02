const mongoose = require('mongoose')

const allListsSchema = new mongoose.Schema({
    title: { type: String, required: true, maxLength: 50, minLength: 3},
    createdAt: {type: Date, required: true},
    updatedAt: {type: Date}
})

module.exports = mongoose.model('AllLists', allListsSchema)