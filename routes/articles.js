const express = require('express');
const router = express.Router();

const Article = require('../models/article');

router.get('/add', function(req, res) {    
    res.render('add_article', {
        title: 'Add Article'
    });
});

router.post('/add', function(req, res) {
    
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // Get Errors
    var errors = req.validationErrors();
    
    if (errors) {
        
        errors.forEach(function(err) {
            req.flash('danger', err.msg);
        });
        
        res.render('add_article', { title: 'Add Article', errors});

    } else {

        var newArticle = new Article({
            title: req.body.title,
            author: req.user.username,
            body: req.body.body,
            user_id: req.user._id
        });
    
        newArticle.save(function(err, response) {
            if (err) {    
                console.log(err);
            } else {    
                req.flash('success', 'Article Added!');
                res.redirect('/');
            }
        });
    }

});

router.get('/:id', function(req, res) {
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

router.get('/edit/:id', function(req, res) {
    
    Article.findById(req.params.id, function(err, article) {
        if (err) {
            console.log(err);

        } else {
            res.render('edit_article', {
                title: article.title,
                author: article.author,
                body: article.body,
                id: article.id,
                user_id: req.user._id
            });
        }
    });    
});

router.post('/edit/:id', function(req, res) {

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

router.delete('/delete/:id', function(req, res) {

    Article.remove({_id: req.params.id}, function(err) {

        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Article Deleted!');        
            res.send('success');
        }

    });
    
});

module.exports = router;