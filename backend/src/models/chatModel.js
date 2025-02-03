const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
  sender: {
    type: String, required: true
  }, receiver: {
    type: String, required: true
  }, message: {
    type: String, required: true
  }, read: {
    type: Boolean, default: false
  }
}, {timestamps: true})

const chatModel = mongoose.model('User', chatSchema)

module.exports = {chatModel}