const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const auth = require('../middlewares/auth');

router.get('/', auth.authenticateGuest, (req, res) => {
    res.render('index/home');
});

router.get('/dashboard', auth.authenticateUser, async (req, res) => {
    const stories = await Story.find({ user: req.user.id });
    res.render('index/dashboard',{stories});
});

router.get('/about',(req, res) => {
    res.render('index/about');
});

router.get('/not-found', (req, res) => {
    res.render('index/not-found');
});

module.exports = router;