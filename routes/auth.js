const express = require('express');

const router = express.Router();

router.get('/google', (req, res) => {
    res.send('Signing in with google');
});

router.get('/callback', (req, res) => {
    res.send('Google auth callback route');
});

module.exports = router;