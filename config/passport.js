const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {

    // LocalStrategy
    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username }, function(err, user) {
                
                // Check for errors
                if (err) {
                    console.log(err);
                    return done(err);
                }

                // If user doesn't exist
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.' });
                }

                // Match Password
                bcrypt.compare(password, user.password, function(err, res) {
                    
                    if (err) {
                        console.log(err);
                        return;
                    }

                    return (res) ? done(null, user) : done(null, false, { message: 'Incorrect password' });
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

