const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next); 
});

router.post('/register', function(req, res) {
    
    let { name, email, username, password, passwordTwo } = req.body;    

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordTwo', 'Password does not match').equals(req.body.password);

    // Get Errors
    var errors = req.validationErrors();

    if (errors) {

        errors.forEach(function(err) {
            req.flash('danger', err.msg);
        });

        res.render('register');

    } else {

        // Hash Password
        var salt = bcrypt.genSalt(10, function(err, salt) {

            bcrypt.hash(password, salt, function(err, hash) {

                if (err) {

                    console.log(err);

                } else {

                    // Save User to DB
                    var newUser = new User ({
                        name,
                        email,
                        username,
                        password: hash
                    });
                    
                    // Save to DB
                    newUser.save(function(err, response) {

                        if (err) {

                            console.log(err);
                            return;

                        } else {

                            req.flash('success', 'Saved username! You can now login.');
                            res.redirect('/users/login');

                        }

                    });

                }

            });

        });

    }
});

module.exports = router;