const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Story = require('../models/Story');

router.get('/', async (req, res) => {
    const stories = await Story.find({status:'public'}).populate('user').sort({date:'desc'});
    res.render('stories/index',{stories});
});

router.get('/story/:id', async(req, res) => {
    const id = req.params.id;
    const story = await Story.findById(id).populate('user').populate('comments.commentUser');
    if(story.status === 'public'){
        res.render('stories/story', {story});
    } else {
        if(req.user){
            if(req.user.id === story.user._id){
                res.render('stories/story', {story});
            } else {
                res.redirect('/stories');
            }
        } else {
            res.redirect('/stories');
        }
    }
});

router.get('/add', auth.authenticateUser,(req, res) => {
    res.render('stories/add');
});

router.get('/edit/:id', auth.authenticateUser, async (req, res) => {
    const id = req.params.id;
    const story = await Story.findById(id);
    if(story.user !== req.user.id){
     return res.redirect('/stories');   
    }
    res.render('stories/edit', {story});
});

router.get('/user/:id', async (req, res) => {
    const id = req.params.id;
    const stories = await Story.find({user:id,status:'public'}).populate('user');
    res.render('stories/index',{stories});
});

router.get('/my', auth.authenticateUser,async (req, res) => {
    const id = req.user.id;
    const stories = await Story.find({user:id}).populate('user');
    res.render('stories/index',{stories});
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

//Add Comment Route

router.post('/comment/:id', async (req, res) => {
    const id = req.params.id;
    let story = await Story.findById(id); 
    const comment = {
        commentBody: req.body.commentBody,
        commentUser: req.user.id
    }
    story.comments.unshift(comment);
    await story.save();
    res.redirect(`/stories/story/${story.id}`);
});

module.exports = router;

