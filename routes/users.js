const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');


const User = require('../models/user');

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    
    let { name, email, username, password, passwordTwo } = req.body;    

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('name', 'Email is required').notEmpty();
    req.checkBody('name', 'Username is required').notEmpty();
    req.checkBody('name', 'Password is required').notEmpty();
    req.checkBody('name', 'Password does not match').notEmpty().equals(req.body.password);

    // Get Errors
    var errors = req.validationErrors();

    if (errors) {

        errors.forEach(function(err) {
            req.flash('danger', err.msg);
        });

        res.render('register');

    } else {

        // Save User to DB
        var newUser = new User ({
            name,
            email,
            username,
            password,
            passwordTwo
        });

        // Hash Password
        var salt = bcrypt.genSalt(10, function(err, salt) {

            bcrypt.hash(password, salt, function(err, hash) {

                if (err) {

                    console.log(err);

                } else {

                    // Change value of password to hash
                    password = hash;

                    // Save to DB
                    newUser.save(function(err, response) {

                        if (err) {

                            console.log(err);
                            return;

                        } else {

                            req.flash('success', 'Saved username!');
                            res.redirect('/users/login');

                        }

                    });

                }

            });

        });

    }

    res.redirect('/users/register');
});

module.exports = router;