const path              = require('path');
const express           = require('express');
const app               = express();
const bodyParser        = require('body-parser');
const session           = require('express-session');
const expressValidator  = require('express-validator');
const connectFlash      = require('connect-flash');

// Connect to DB
const mongoose = require('mongoose');
const DATABASE = require('./constants').DATABASE;
mongoose.connect(DATABASE);
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

// Set up View Engine Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
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

app.get('/article/add', function(req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

app.post('/article/add', function(req, res) {

    var newArticle = new Article({
        title: req.body.title,
        author: req.body.author,
        body: req.body.body
    });

    newArticle.save(function(err, response) {
        if (err) {

            console.log(err);

        } else {

            req.flash('success', 'Article Added!');
            res.redirect('/');

        }
    });
});

app.get('/article/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            console.log(err);
        } else {        
            res.render('article', {
                title: article.title,
                author: article.author,
                body: article.body,
                id: article.id
            });
        }
    });
    
});

app.get('/article/edit/:id', function(req, res) {
    
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            console.log(err);

        } else {
            res.render('edit_article', {
                title: article.title,
                author: article.author,
                body: article.body,
                id: article.id
            });
        }
    });    
});

app.post('/article/edit/:id', function(req, res) {
   
    var article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    Article.update(
        { _id: req.params.id },
        article,
        function(err, response) {
        req.flash('success', 'Article Updated!');        
        res.redirect('/');
    });
    
});

app.delete('/article/delete/:id', function(req, res) {

    Article.remove({_id: req.params.id}, function(err) {

        if (err) {
            console.log(err);
        } else {
            res.send('success');
        }

    });
    
});

const port = 3000;
app.listen(port, () => {
    console.log(`Now listening to port: ${port}`);
});