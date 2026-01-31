const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: function() {
      return this.messageType === 'text';
    }
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'voice', 'video', 'file', 'location'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // for voice/video messages in seconds
    default: 0
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);