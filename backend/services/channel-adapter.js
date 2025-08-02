const API_URL = 'http://localhost:8000'

const channel = "chat"
export async function textInputForward(text, userId, sessionId) {
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
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });
  return response.json();
}