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
  }, seller: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  }, buyer: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null
  }, status: {
    type: String, enum: ['available', 'sold'], default: 'available'
  }, images: [{data: Buffer, contentType: String}]
}, {timestamps: true})

postSchema.index({seller: 1, status: 1})

const postModel = mongoose.model('Post', postSchema)
module.exports = {postModel}
