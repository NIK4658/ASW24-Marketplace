const { chatModel } = require('../models/chatModel')

exports.logChat = async (req, res) => {
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

exports.getPreviewsByUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const chats = await chatModel.find({ $or: [{ sender: userId }, { receiver: userId }] }).sort({ createdAt: -1 })
    const previews = []
    const users = {}
    for (const chat of chats) {
      const otherUserId = chat.sender === userId ? chat.receiver : chat.sender
      if (!users[otherUserId]) {
        users[otherUserId] = true
        previews.push(chat)
      }
    }
    res.status(200).json(previews)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the chats. ' + error })
  }
}

exports.getChatsBetweenUsers = async (req, res) => {
  try {
    const userId1 = req.params.userId1
    const userId2 = req.params.userId2
    const chats = await chatModel.find({ $or: [{ sender: userId1, receiver: userId2 }, { sender: userId2, receiver: userId1 }] }).sort({ createdAt: 1 })
    res.status(200).json(chats)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the chats. ' + error })
  }
}

exports.readChatsBetweenUsers = async (req, res) => {
  try {
    const userId1 = req.params.userId1
    const userId2 = req.params.userId2
    await chatModel.updateMany({ sender: userId1, receiver: userId2 }, { read: true })
    res.status(200).json({ message: 'Chats marked as read.' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while marking the chats as read. ' + error })
  }
}

exports.deleteChatsBetweenUsers = async (req, res) => {
  try {
    const userId1 = req.params.userId1
    const userId2 = req.params.userId2
    await chatModel.deleteMany({ $or: [{ sender: userId1, receiver: userId2 }, { sender: userId2, receiver: userId1 }] })
    res.status(200).json({ message: 'Chats deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while deleting the chats. ' + error })
  }
}
