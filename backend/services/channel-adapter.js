const API_URL = 'http://localhost:8000'
const fetch = require('node-fetch');
const FormData = require('form-data');
/**
 * Send audio to voice-to-voice API
 * @param {Buffer} audioBuffer - Audio file buffer
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @returns {Promise<Response>} - Fetch response
 */
async function sendVoiceToVoice(audioBuffer, userId, sessionId, authorization) {
  const form = new FormData();
  form.append('file', audioBuffer, {
    filename: 'audio.m4a',
    contentType: 'audio/x-m4a'
  });
  form.append('session_id', sessionId);
  form.append('user_id', userId);
  form.append('channel', 'voice');
  form.append('voice_language', '');
  form.append('slow', '');

  try {
    const response = await fetch(
      `${API_URL}/voice-to-voice/?language=en-US`,
      {
        method: 'POST',
        body: form,
        headers: {
          ...form.getHeaders(),
          'Authorization': authorization,
          'accept': 'application/json'
        }
      }
    );
    // Debug response headers
    console.log('Voice-to-voice response headers:', response.headers.raw());

    // Debug response body (file)
    const buffer = await response.buffer();
    console.log('Voice-to-voice response body buffer length:', buffer.length);
    return { headers: response.headers.raw(), buffer };
  } catch (err) {
    console.error('Voice-to-voice API error:', err.message);
    throw err;
  }
}

const channel = "chat"

async function textInputForward(text, userId, sessionId, authorization) {
  const params = new URLSearchParams();
  params.append('text', text);
  params.append('source', '');
  params.append('timestamp', '');
  params.append('include_metadata', '');
  params.append('custom_headers', '');
  params.append('session_id', sessionId);
  params.append('user_id', userId);
  params.append('channel', 'ui');

  const response = await fetch(`${API_URL}/text-input-forward/`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': authorization
    },
    body: params.toString()
  });
  return response.json();
}

module.exports = {
  textInputForward,
  sendVoiceToVoice
};