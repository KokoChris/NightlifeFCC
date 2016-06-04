const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/logout', (req, res, next) => {
    req.flash("success", "Bye Bye")
    req.logout();
    res.redirect('/');
})

router.get('/foursquare',
    passport.authenticate('foursquare'));

router.get('/foursquare/callback',
    passport.authenticate('foursquare', { failureRedirect: '/' }),
    function(req, res) {
        req.flash("success", "Welcome " + req.user.fullName)

        if (req.session.location) {
            res.redirect('/bars?location=' + req.session.location);
        } else {

            res.redirect('/');

        }
    })

module.exports = router;
