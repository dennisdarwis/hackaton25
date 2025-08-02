const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ['send', 'receive'], required: true },
  senderName: { type: String },
  recipientName: { type: String },
  message: { type: String, required: true },
  datetime: { type: Date, required: true }
});

module.exports = mongoose.model('Message', messageSchema);
