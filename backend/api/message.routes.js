const express = require('express');
const router = express.Router();
const Message = require('./message.model');
const Audio = require('./audio.model');
const multer = require('multer');
const { textInputForward } = require('../services/channel-adapter');
const upload = multer();

// Fetch all chat messages
// Fetch messages for a specific recipient (username from header)
router.get('/', async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }
    const messages = await Message.find({ isAudio: false, $or: [{ recipientName: username }, { senderName: username }] }).sort({ datetime: 1 });
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all audio messages
// Fetch messages for a specific recipient (username from header)
router.get('/audio', async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }
    const messages = await Message.find({ isAudio: true, $or: [{ recipientName: username }, { senderName: username }] }).sort({ datetime: 1 });
    await new Promise(resolve => setTimeout(resolve, 500));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Send a new message (text)
router.post('/', async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }

    const { type, message } = req.body;
    const response = await textInputForward(message, username, username);
    const responseMessage = response.forward_result.response_data.response.agent_response
    // console.log(`lel ${responseMessage}`);
    const newMessage = new Message({ type, senderName: username, message, datetime: new Date().toISOString() });
    await newMessage.save();
    // wait 3 seconds before sending the response
    const receivedMessage = new Message({ type: 'receive', recipientName: username, senderName: null, message: responseMessage, datetime: new Date().toISOString() });
    await receivedMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send a new audio message
router.post('/audio', upload.single('audio'), async (req, res) => {
  try {
    const username = req.headers['username'];
    if (!username) {
      return res.status(400).json({ error: 'Username header is required' });
    }
    const { type = 'send' } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }
    const audioBuffer = req.file.buffer;
    const audioMimeType = req.file.mimetype;
    // Save audio to Audio collection
    const audioDoc = new Audio({
      data: audioBuffer,
      contentType: audioMimeType
    });
    await audioDoc.save();
    // Reference audio by its MongoDB ObjectId
    const audioURL = `/api/messages/audio/${audioDoc._id}`;
    const newMessage = new Message({
      type,
      senderName: username,
      message: '', // No text message
      datetime: new Date().toISOString(),
      isAudio: true,
      audioURL
    });

    // Send API request to Keren's AI Service
    /**
     * "text": "Yes,I confirm",
        "user_id": "parthi_211",
        "session_id": "parthi_213",
        "channel": "chat"
        "file": file binary
     */
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Serve audio file by id
router.get('/audio/:id', async (req, res) => {
  try {
    const audioDoc = await Audio.findById(req.params.id);
    if (!audioDoc) {
      return res.status(404).json({ error: 'Audio not found' });
    }
    res.set('Content-Type', audioDoc.contentType);
    res.send(audioDoc.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
