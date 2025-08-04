const express = require('express');
const router = express.Router();
const Message = require('./message.model');
const Audio = require('./audio.model');
const multer = require('multer');
const { textInputForward, sendVoiceToVoice } = require('../services/channel-adapter');
const upload = multer();

// Fetch all chat messages
// Fetch messages for a specific recipient (username from header)
router.get('/', async (req, res) => {
  try {
    const username = req.headers['username'];
    console.log('Fetching messages for username:', username);
    if (!username) {
      console.log('Username header is missing');
      return res.status(400).json({ error: 'Username header is required' });
    }
    const messages = await Message.find({ isAudio: false, $or: [{ recipientName: username }, { senderName: username }] }).sort({ datetime: 1 });
    console.log('Fetched messages:', messages.length);
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message);
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
      console.warn('Username header missing in text message POST');
      return res.status(400).json({ error: 'Username header is required' });
    }

    const { type, message } = req.body;
    console.log('Creating new message:', { type, senderName: username, message });
    const newMessage = new Message({ type, senderName: username, message, datetime: new Date().toISOString() });
    await newMessage.save();
    console.log('New message saved:', newMessage);

    console.log('Forwarding message to textInputForward:', { message, username });
    const response = await textInputForward(message, username, username, req.headers['authorization']);
    console.log('Received response from textInputForward:', response);
    const responseMessage = response.forward_result.response_data.response.agent_response;

    console.log('Creating received message:', { type: 'receive', recipientName: username, senderName: null, message: responseMessage });
    const receivedMessage = new Message({ type: 'receive', recipientName: username, senderName: null, message: responseMessage, datetime: new Date().toISOString() });
    await receivedMessage.save();
    console.log('Received message saved:', receivedMessage);

    console.log('Text message saved:', newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error in text message POST:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Send a new audio message
router.post('/audio', upload.single('audio'), async (req, res) => {
  try {
    console.log('Audio message POST request:', { headers: req.headers, body: req.body });
    const username = req.headers['username'];
    if (!username) {
      console.warn('Username header missing in audio message POST');
      return res.status(400).json({ error: 'Username header is required' });
    }
    const { type = 'send' } = req.body;
    if (!req.file) {
      console.warn('Audio file missing in audio message POST');
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
    await newMessage.save();

    // Send API request to Keren's AI Service
    // Send request to external voice-to-voice API
    const response = await sendVoiceToVoice(audioBuffer, username, username, req.headers['authorization']);
    // Save audio to Audio collection
    const respAudioDoc = new Audio({
      data: response.buffer,
      contentType: "audio/x-m4a"
    });
    await respAudioDoc.save();
    // Reference audio by its MongoDB ObjectId
    const respAudioURL = `/api/messages/audio/${respAudioDoc._id}`;
    const receivedMessage = new Message({
      type: 'receive',
      recipientName: username,
      message: '', // No text message
      datetime: new Date().toISOString(),
      isAudio: true,
      audioURL: respAudioURL
    });
    await receivedMessage.save();

    console.log('Audio message saved:', newMessage);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error in audio message POST:', err.message);
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
