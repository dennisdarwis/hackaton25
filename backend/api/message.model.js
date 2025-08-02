const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ['send', 'receive'], required: true },
  senderName: { type: String },
  recipientName: { type: String },
  message: { type: String }, // Not required for audio
  datetime: { type: Date, required: true },
  isAudio: { type: Boolean, default: false },
  audioURL: { type: String }
});

module.exports = mongoose.model('Message', messageSchema);
