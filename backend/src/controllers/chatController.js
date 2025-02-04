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

exports.getChatsByUser = async (req, res) => {
  try {
    const { userId } = req.params
    const chats = await chatModel.find({ $or: [{ sender: userId }, { receiver: userId }] })
    res.status(200).json(chats)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the chats. ' + error })
  }
}

// TODO: mark chat as read