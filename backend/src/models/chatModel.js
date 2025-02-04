const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, required: true
  }, receiver: {
    type: mongoose.Schema.Types.ObjectId, required: true
  }, message: {
    type: String, required: true
  }, read: {
    type: Boolean, default: false
  }
}, {timestamps: true})

const chatModel = mongoose.model('Chat', chatSchema)

module.exports = {chatModel}