const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', auth.authenticateGuest, (req, res) => {
    res.render('index/home');
});

router.get('/dashboard', auth.authenticateUser, (req, res) => {
    res.render('index/dashboard');
});

router.get('/about',(req, res) => {
    res.render('index/about');
});

router.get('/not-found', (req, res) => {
    res.render('index/not-found');
})

module.exports = router;