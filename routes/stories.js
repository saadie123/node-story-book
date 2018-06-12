const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

router.get('/', (req, res) => {
    res.render('stories/index');
});

router.get('/story/:id',(req, res) => {
    res.render('stories/story');
});

router.get('/add', auth.authenticateUser,(req, res) => {
    res.render('stories/add');
});

router.get('/edit/:id', auth.authenticateUser,(req, res) => {
    res.render('stories/edit');
});

module.exports = router;

