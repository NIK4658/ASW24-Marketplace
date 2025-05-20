const { roomModel } = require('../models/roomModel')
const mongoose = require('mongoose')

exports.createRoom = async (req, res) => {
  try {
    const { user1, user2 } = req.body

    if (!mongoose.Types.ObjectId.isValid(user1) || !mongoose.Types.ObjectId.isValid(user2)) {
      return res.status(400).json({ message: 'Invalid users ID' })
    }

    const existingRoom = await roomModel.findOne({
      $or: [
        { user1, user2 },
        { user1: user2, user2: user1 }
      ]
    })

    if (existingRoom) {
      return res.status(200).json(existingRoom) // 200 OK, since the room already exists
    }

    const newRoom = await new roomModel({ user1, user2 })
    const savedRoom = await newRoom.save()

    res.status(201).json(savedRoom)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the room. ' + error })
  }
}

exports.deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: 'Invalid room ID' })
    }

    const room = await roomModel.findByIdAndDelete(roomId)

    if (!room) {
      return res.status(404).json({ message: 'Room not found' })
    }

    res.status(200).json({ message: 'Room deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while deleting the room. ' + error })
  }
}