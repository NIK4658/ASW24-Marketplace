const { chatModel } = require('../models/chatModel')
const mongoose = require('mongoose')

exports.createChat = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body
    if (!sender || !receiver || !message) {
      return res.status(400).json({ error: 'All required fields must be provided.' })
    }
    const newChat = new chatModel({ sender, receiver, message })
    const savedChat = await newChat.save()
    res.status(201).json(savedChat)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the chat. ' + error })
  }
}

exports.getChatByUser = async (req, res) => {
  try {
    const { user } = req.query
    if (!user) {
      return res.status(400).json({ error: 'User must be provided.' })
    }
    const chats = await chatModel.find({ $or: [{ sender: user }, { receiver: user }] })
    res.status(200).json(chats)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while getting the chat. ' + error })
  }
}
