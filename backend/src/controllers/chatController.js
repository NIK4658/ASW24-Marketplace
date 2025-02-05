const { chatModel } = require('../models/chatModel')
const { userModel } = require('../models/userModel')
const mongoose = require('mongoose')

exports.logChat = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body

    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: 'Invalid users ID' })
    }

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

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' })
    }

    const chats = await chatModel.find({ $or: [{ sender: userId }, { receiver: userId }] }).sort({ createdAt: -1 })
    const previews = []
    const users = {}
    for (const chat of chats) {
      const otherUserId = chat.sender === userId ? chat.receiver : chat.sender
      if (!users[otherUserId]) {
        users[otherUserId] = true
        const user = await userModel.findById(otherUserId) 
        previews.push({
          _id: chat._id,
          image: user.image, 
          username: user.username, 
          message: chat.message,
          time: chat.createdAt,
          read: chat.read
        })
      }
    }
    res.status(200).json(previews)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the chats. ' + error })
  }
}

exports.getChatData = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: 'Invalid chat ID' });
    }

    const chat = await chatModel.findById(chatId)
      .populate('sender', 'username')
      .populate('receiver', 'username');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const chatData = {
      ...chat.toObject(),
      senderUsername: chat.sender.username,
      receiverUsername: chat.receiver.username
    };

    res.status(200).json(chatData);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while fetching the chat. ' + error });
  }
};

exports.getChatsBetweenUsers = async (req, res) => {
  try {
    const userId1 = req.params.userId1
    const userId2 = req.params.userId2

    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
      return res.status(400).json({ message: 'Invalid users ID' })
    }

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

    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
      return res.status(400).json({ message: 'Invalid users ID' })
    }

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

    if (!mongoose.Types.ObjectId.isValid(userId1) || !mongoose.Types.ObjectId.isValid(userId2)) {
      return res.status(400).json({ message: 'Invalid users ID' })
    }

    await chatModel.deleteMany({ $or: [{ sender: userId1, receiver: userId2 }, { sender: userId2, receiver: userId1 }] })
    res.status(200).json({ message: 'Chats deleted.' })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while deleting the chats. ' + error })
  }
}
