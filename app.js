const path = require('path');
const express = require('express');
const app = express();

// Set up View Engine Middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
    res.end('hello');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Now listening to port: ${port}`);
});