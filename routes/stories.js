const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/Story');

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

router.post('/add', auth.authenticateUser, async (req, res) => {
    const errors = {
        title: [],
        body: []
    }
    if(!req.body.title){
        errors.title.push({message: 'Story title is required!'});
    }
    if(!req.body.body){
        errors.body.push({message:'Story detail / body is required'});
    }
    if(errors.title.length > 0 || errors.body.length > 0){
        return res.render('stories/add',{errors});
    }
    let allowComments;
    if(req.body.allowComments === 'on'){
        allowComments = true
    } else {
        allowComments = false
    }
    const story = new Story({
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    });
    const newStory = await story.save();
    res.redirect(`/stories/story/${newStory._id}`);
});

module.exports = router;

