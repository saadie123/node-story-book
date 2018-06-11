const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const keys = require('./keys');
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        let user = await User.findById(id);
        done(null, user);
    } catch (error) {
        console.log(error);
    }
});

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/callback'
}, async (accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({
        googleID: profile.id
    });
    if (user) {
        return done(null, user)
    }
    const newUser = new User({
        googleID: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'))
    });
    user = await newUser.save();
    done(null, user);
}));