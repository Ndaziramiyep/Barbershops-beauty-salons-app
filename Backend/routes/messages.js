const express = require('express');
const Message = require('../models/Message');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

const router = express.Router();

// Get conversations for a user
router.get('/conversations', async (req, res) => {
  try {
    // For testing - using hardcoded user ID
    const userId = '507f1f77bcf86cd799439011';
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(userId) },
            { receiver: new mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', new mongoose.Types.ObjectId(userId)] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contact'
        }
      },
      {
        $unwind: '$contact'
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between two users
router.get('/:contactId', async (req, res) => {
  try {
    const contactId = req.params.contactId;

    const messages = await Message.find({
      $or: [
        { sender: contactId },
        { receiver: contactId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  try {
    const message = new Message({
      sender: '507f1f77bcf86cd799439011', // Hardcoded sender for now
      receiver: req.body.receiver,
      content: req.body.content,
      messageType: req.body.messageType || 'text'
    });

    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get my conversations (users I've messaged)
router.get('/my-conversations', async (req, res) => {
  try {
    const currentUserId = '507f1f77bcf86cd799439011'; // Should come from auth
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', new mongoose.Types.ObjectId(currentUserId)] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $last: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: '$user._id',
          name: '$user.name',
          email: '$user.email',
          phone: '$user.phone',
          avatar: '$user.avatar',
          isOnline: false,
          lastMessage: '$lastMessage.content',
          lastMessageTime: '$lastMessage.createdAt',
          unreadCount: 0
        }
      }
    ]);
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark messages as read
router.patch('/:contactId/read', async (req, res) => {
  try {
    const contactId = req.params.contactId;
    const currentUserId = '507f1f77bcf86cd799439011'; // Should come from auth
    
    await Message.updateMany(
      {
        sender: contactId,
        receiver: currentUserId,
        isRead: false
      },
      { isRead: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;