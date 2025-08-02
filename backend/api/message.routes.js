const express = require('express');
const router = express.Router();
const Message = require('./message.model');

// Fetch all messages
// Fetch messages for a specific recipient (username from header)
router.get('/', async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }
    console.log(`Fetching messages for recipient: ${username}`);
    const messages = await Message.find({ $or: [ { recipientName: username }, { senderName: username } ] }).sort({ datetime: 1 });
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a new message
router.post('/', async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }
    const { type, message, datetime, recipient } = req.body;
    const newMessage = new Message({ type, senderName: username, message, datetime, recipient });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
