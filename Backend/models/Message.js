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
    enum: ['text', 'image', 'voice', 'video', 'file', 'location', 'call'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    default: ''
  },
  duration: {
    type: String, // for voice/video/call messages
    default: ''
  },
  callType: {
    type: String,
    enum: ['voice', 'video']
  },
  callStatus: {
    type: String,
    enum: ['missed', 'answered', 'declined']
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