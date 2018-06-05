const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google',{
    scope:['profile','email']
}));

router.get('/callback', passport.authenticate('google',{
    failureRedirect: '/',
    successRedirect: '/'
}));

module.exports = router;