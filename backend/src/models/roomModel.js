const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  }, user2: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  }
}, {timestamps: true})

const roomModel = mongoose.model('Room', roomSchema)

module.exports = {roomModel}