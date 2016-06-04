'use strict';
const passport = require('passport');
const config = require('../config');
const h = require('../helpers');
const FourSquareStrategy = require('passport-foursquare').Strategy;

module.exports = function() {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
    	h.findById(id)
    		.then(user => done(null, user))
    		.catch(error => console.log('Error when deserializingUser'));
    });




    let authProcessor = (accessToken, refreshToken, profile, done) => {

        h.findOne(profile.id)
            .then(function(result) {
                if (result) {
                    done(null, result);
                } else {
                   
                    h.createNewUser(profile,accessToken)
                        .then(newChatUser => done(null, newChatUser))
                        .catch(error => console.log(error));
                }
            })
    }

    passport.use(new FourSquareStrategy(config.foursquare, authProcessor));

}
