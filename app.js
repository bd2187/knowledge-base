const path = require('path');
const express = require('express');
const app = express();

// Set up View Engine Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', function(req, res) {
    res.render('index', {
        title: 'Articles'
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