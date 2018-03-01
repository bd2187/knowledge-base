const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport, username, password) {

    // LocalStrategy
    passport.use(new LocalStrategy(

        function(username, password, done) {

            User.findOne({ username }, function(err, user) {

                // Check for errors
                if (err) {
                    console.log(err);
                    return;
                }

                // If user doesn't exist
                if (!user) {
                    return done(null, false, { messge: 'Incorrect username.' });
                }

                // Match Password
                bcrypt.compare(password, user.password, function(err, res) {
                    
                    if (err) {
                        console.log(err);
                        return;
                    }

                    if (res) {

                        // If no errors, return user
                        return done(null, user);

                    } else {

                        // If password is incorrect
                        if (!user.validPassword(password)) {
                            return done(null, false, { message: 'Incorrect password' });
                        }

                    }
                });

                passport.serializeUser(function(user, done) {
                    done(null, user.id);
                    
                });

                passport.deserializeUser(function(id, done) {
                    User.findById(id, function(err, user) {
                        done(err, user);
                    });                    
                });                

            });
        }
    ));
}
