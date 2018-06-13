const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/Story');

router.get('/', async (req, res) => {
    const stories = await Story.find({status:'public'}).populate('user');
    res.render('stories/index',{stories});
});

router.get('/story/:id', async(req, res) => {
    const id = req.params.id;
    const story = await Story.findById(id).populate('user');
    res.render('stories/story', {story});
});

router.get('/add', auth.authenticateUser,(req, res) => {
    res.render('stories/add');
});

router.get('/edit/:id', auth.authenticateUser, async (req, res) => {
    const id = req.params.id;
    const story = await Story.findById(id);
    res.render('stories/edit', {story});
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

router.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    let allowComments;
    if(req.body.allowComments === 'on'){
        allowComments = true;
    } else {
        allowComments = false;
    }
    let story = {
        title: req.body.title,
        body: req.body.body,
        allowComments,
        status: req.body.status
    }
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
        return res.render('stories/edit',{errors,story});
    }
    await Story.findByIdAndUpdate(id,{$set:story});
    res.redirect('/dashboard');
});

router.delete('/story/:id', async (req, res) => {
    const id = req.params.id;
    await Story.findByIdAndRemove(id);
    res.redirect('/dashboard');
});

module.exports = router;

