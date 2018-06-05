const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

// Passport config
require('./config/passport');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodbURL);

app.use(session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized:true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Story Book app is running');
});

app.use('/auth',authRoutes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});