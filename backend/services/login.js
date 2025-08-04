

const fetch = require('node-fetch');
const FormData = require('form-data');

const LOGIN_URL = 'http://localhost:8004/token';
/**
 * Logs in a user by sending credentials to the /token endpoint.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access_token: string, token_type: string}>}
 */

async function login(username, password) {
    const form = new FormData();
    form.append('username', username);
    form.append('password', password);

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            body: form,
            headers: form.getHeaders(),
        });
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

module.exports = { login };
