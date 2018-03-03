const path              = require('path');
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const session           = require('express-session');
const expressValidator  = require('express-validator');
const connectFlash      = require('connect-flash');
const articleRoutes     = require('./routes/articles');
const userRoutes        = require('./routes/users');
const config            = require('./config/database');
const passport          = require('passport');

// Connect to DB
const mongoose = require('mongoose');
mongoose.connect(config.DATABASE);
const db = mongoose.connection;
db.on('error', (err) => { console.log(err) });
db.once('open', () => { console.log('DB connected') });

// Bring in Models
const Article = require('./models/article');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Connect-Flash & Express-Messages Middleware
app.use(connectFlash());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

// Passport Config
require('./config/passport')(passport);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set up global variable. Req.user = signed in user
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});

// Set up View Engine Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', function(req, res) {

    Article.find({}, function(err, response) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: response
            });
        }
    });
});

app.use('/article', articleRoutes);
app.use('/users', userRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Now listening to port: ${port}`);
});