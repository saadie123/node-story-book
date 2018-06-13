const path = require('path');
const express = require('express');
const expresshbs = require('express-handlebars');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const passport = require('passport');
const mongoose = require('mongoose');

// Passport config
require('./config/passport');

const helpers = require('./helpers/hbs');
const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const storiesRoutes = require('./routes/stories');
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongodbURL);

app.use(express.static(path.join(__dirname,'public')));
app.engine('.hbs', expresshbs({ 
    defaultLayout: 'main', 
    extname: '.hbs', 
    helpers:{
        truncate:helpers.truncate, 
        stripTags: helpers.stripTags,
        formatDate: helpers.formatDate,
        select: helpers.select
    }
}));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
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
app.use('/stories', storiesRoutes);

app.use('*', (req, res) => {
    res.redirect('/not-found');
});

const port = process.env.PORT || 5050;
app.listen(port, () => {
    console.log(`App running on port ${port}`);
});