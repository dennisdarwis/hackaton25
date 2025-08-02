const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Audio', audioSchema);
