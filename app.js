const path = require('path');
const express = require('express');
const app = express();

// Set up View Engine Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', function(req, res) {

    var articles = [
        {
            id: 1,
            title: 'Article 1',
            author: 'John Doe',
            body: 'This is article 1'
        },
        {
            id: 2,
            title: 'Article 2',
            author: 'Jane Doe',
            body: 'This is article 2'
        },
        {
            id: 3,
            title: 'Article 3',
            author: 'Bob Doe',
            body: 'This is article 3'
        },
    ];

    res.render('index', {
        title: 'Articles',
        articles
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