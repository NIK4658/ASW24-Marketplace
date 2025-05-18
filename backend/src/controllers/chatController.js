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
    const savedChat = await newChat.save();
    await savedChat.populate('sender', 'username');
    await savedChat.populate('receiver', 'username');
    res.status(201).json(savedChat)
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong while creating the chat. ' + error })
  }
}

exports.getPreviewsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const lastMessages = await chatModel.aggregate([
      {
        $match: { 
          $or: [{ sender: new mongoose.Types.ObjectId(userId) }, { receiver: new mongoose.Types.ObjectId(userId) }]
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by latest message first
      },
      {
        $group: {
          _id: {
            user1: { $cond: [{ $gt: ['$sender', '$receiver'] }, '$sender', '$receiver'] },
            user2: { $cond: [{ $gt: ['$sender', '$receiver'] }, '$receiver', '$sender'] }
          },
          lastMessage: { $first: '$$ROOT' } // Pick the latest message
        }
      }
    ]);

    const previews = await Promise.all(
      lastMessages.map(async ({ lastMessage }) => {
        const otherUserId = lastMessage.sender.toString() === userId ? lastMessage.receiver : lastMessage.sender;
        const user = await userModel.findById(otherUserId, 'username image'); // Fetch user data

        const formattedImage = {
          data: user.image.data.toString('base64'),
          contentType: user.image.contentType
        };

        return {
          _id: lastMessage._id,
          image: formattedImage,
          username: user?.username || 'Unknown',
          sender: lastMessage.sender,
          message: lastMessage.message,
          time: lastMessage.createdAt,
          read: lastMessage.read
        };
      })
    );

    // Sort previews by time descending (most recent first)
    previews.sort((a, b) => new Date(b.time) - new Date(a.time));

    res.status(200).json(previews);
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

    res.status(200).json(chat);
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
      .populate('sender', 'username')
      .populate('receiver', 'username');
      
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
    
    await chatModel.updateMany(
      { sender: userId1, receiver: userId2 },
      { $set: { read: true } }
    );

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
