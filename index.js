const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const mongoose = require('mongoose');

// Passport config
require('./config/passport');

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodbURL);

app.use(express.static(path.join(__dirname,'public')));
app.engine('.hbs', expresshbs({ defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(cookieParser());
app.use(session({
    secret: keys.sessionSecret,
    resave: true,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());

// Setting global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});


app.use('/', indexRoutes);
app.use('/auth', authRoutes);

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});