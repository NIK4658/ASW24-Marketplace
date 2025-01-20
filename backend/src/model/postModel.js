const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
  title: {
    type: String, required: true
  }, price: {
    type: Number, required: true
  }, condition: {
    type: String, enum: ['new', 'used', 'refurbished'], required: true
  }, description: {
    type: String, required: true
  }, user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  }
}, { timestamps: true })

const postModel = mongoose.model('Post', postSchema)
module.exports = { postModel }
