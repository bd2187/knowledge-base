const path = require('path');
const express = require('express');
const app = express();

// Connect to DB
const mongoose = require('mongoose');
const DATABASE = require('./constants').DATABASE;
mongoose.connect(DATABASE);
const db = mongoose.connection;
db.on('error', (err) => { console.log(err) });
db.once('open', () => { console.log('DB connected') });

// Bring in Models
const Article = require('./models/article');

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

const port = 3000;
app.listen(port, () => {
    console.log(`Now listening to port: ${port}`);
});