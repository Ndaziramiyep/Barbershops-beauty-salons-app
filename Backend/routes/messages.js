const express = require('express');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

const router = express.Router();

// Get conversations for a user
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { receiver: mongoose.Types.ObjectId(userId) }
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
              { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
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
                    { $eq: ['$receiver', mongoose.Types.ObjectId(userId)] },
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
router.get('/:contactId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    })
    .populate('sender', 'name avatar')
    .populate('receiver', 'name avatar')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: contactId, receiver: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const message = new Message({
      sender: req.user.id,
      ...req.body
    });

    await message.save();
    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;