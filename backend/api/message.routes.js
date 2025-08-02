const express = require('express');
const router = express.Router();
const Message = require('./message.model');

// Fetch all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().sort({ datetime: 1 });
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send a new message
router.post('/', async (req, res) => {
  try {
    const { type, senderName, message, datetime } = req.body;
    const newMessage = new Message({ type, senderName, message, datetime });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
