
const express = require('express');
const router = express.Router();
const { login } = require('../services/login');

// POST /login endpoint
router.post('/', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const tokenData = await login(username, password);
        res.json(tokenData);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

module.exports = router;
